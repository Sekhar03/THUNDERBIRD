package handler

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"time"
)

// Position represents the 3D position of a satellite
type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

// Satellite represents a satellite in the system
type Satellite struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	OrbitType      string    `json:"orbitType"`
	Altitude       float64   `json:"altitude"`
	Inclination    float64   `json:"inclination"`
	Position       Position  `json:"position"`
	LastContact    time.Time `json:"lastContact"`
	QuantumKeyID   string    `json:"quantumKeyId"`
	KeyGeneration  time.Time `json:"keyGeneration"`
	Status         string    `json:"status"`
}

const (
	EarthRadius = 6371.0   // km
	GM          = 398600.0 // Earth's gravitational parameter (km³/s²)
)

// calculatePeriod calculates the orbital period using Kepler's third law
func calculatePeriod(altitude float64) float64 {
	semiMajorAxis := EarthRadius + altitude
	return 2 * math.Pi * math.Sqrt(math.Pow(semiMajorAxis, 3)/GM)
}

// Handler is the Vercel entry point
func Handler(w http.ResponseWriter, r *http.Request) {
	// CORS Headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Stable seed based on current hour to keep satellites consistent for a while
	now := time.Now()
	hourSeed := now.Truncate(time.Hour).Unix()
	rand.Seed(hourSeed)

	numSatellites := 5
	satellites := make([]Satellite, numSatellites)

	for i := 0; i < numSatellites; i++ {
		// Use i as offset for deterministic orbits per hour
		orbitSeed := hourSeed + int64(i*1000)
		r := rand.New(rand.NewSource(orbitSeed))

		altitude := 500.0 + float64(r.Intn(300))
		inclination := 45.0 + float64(r.Intn(45))
		ascendingNode := float64(r.Intn(360))
		initialAnomaly := float64(r.Intn(360))
		
		// Calculate position based on current time
		// Stable launch time for this hour segment
		launchTime := now.Truncate(time.Hour).Add(-time.Hour)
		timeElapsed := now.Sub(launchTime).Seconds()

		period := calculatePeriod(altitude)
		currentAnomaly := initialAnomaly + (timeElapsed/period)*360.0
		angleRad := currentAnomaly * math.Pi / 180.0
		radius := EarthRadius + altitude

		// Orbital plane
		xOrbit := radius * math.Cos(angleRad)
		yOrbit := radius * math.Sin(angleRad)

		// Inclination
		inclRad := inclination * math.Pi / 180.0
		xIncl := xOrbit
		yIncl := yOrbit * math.Cos(inclRad)
		zIncl := yOrbit * math.Sin(inclRad)

		// Ascending node
		nodeRad := ascendingNode * math.Pi / 180.0
		x := xIncl*math.Cos(nodeRad) - yIncl*math.Sin(nodeRad)
		y := xIncl*math.Sin(nodeRad) + yIncl*math.Cos(nodeRad)
		z := zIncl

		satellites[i] = Satellite{
			ID:            fmt.Sprintf("SAT-%03d", i+1),
			Name:          fmt.Sprintf("ThunderBird-%d", i+1),
			OrbitType:     "LEO",
			Altitude:      altitude,
			Inclination:   inclination,
			Position:      Position{X: x, Y: y, Z: z},
			LastContact:   now,
			QuantumKeyID:  fmt.Sprintf("QK-%05d", r.Intn(90000)+10000),
			KeyGeneration: now.Truncate(time.Minute),
			Status:        "operational",
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(satellites)
}
