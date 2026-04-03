package handler

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

// Satellite represents a satellite in the system
type Satellite struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	OrbitType     string    `json:"orbitType"`
	Altitude      float64   `json:"altitude"`
	Inclination   float64   `json:"inclination"`
	Position      Position  `json:"position"`
	LastContact   time.Time `json:"lastContact"`
	QuantumKeyID  string    `json:"quantumKeyId"`
	KeyGeneration time.Time `json:"keyGeneration"`
	Status        string    `json:"status"`
}

// Position represents the 3D position of a satellite
type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

// BlockchainStatus represents the status of the blockchain
type BlockchainStatus struct {
	BlockHeight      int       `json:"blockHeight"`
	LastBlockTime    time.Time `json:"lastBlockTime"`
	ActiveValidators int       `json:"activeValidators"`
	TransactionCount int       `json:"transactionCount"`
	NetworkStatus    string    `json:"networkStatus"`
}

// AIMetrics represents AI system metrics
type AIMetrics struct {
	ThreatDetectionAccuracy float64 `json:"threatDetectionAccuracy"`
	AnomalyDetectionRate    float64 `json:"anomalyDetectionRate"`
	ResponseTime            float64 `json:"responseTime"`
	LearningProgress        float64 `json:"learningProgress"`
	ActiveThreats           int     `json:"activeThreats"`
	ResolvedThreats         int     `json:"resolvedThreats"`
}

// SystemStatus represents the overall system status
type SystemStatus struct {
	Satellites     []Satellite      `json:"satellites"`
	BlockchainData BlockchainStatus `json:"blockchainData"`
	QuantumKeyPool int              `json:"quantumKeyPool"`
	ActiveChannels int              `json:"activeChannels"`
	SystemMode     string           `json:"systemMode"`
	LastUpdateTime time.Time        `json:"lastUpdateTime"`
	AIMetrics      AIMetrics        `json:"aiMetrics"`
}

// Handler is the Vercel entry point
func Handler(w http.ResponseWriter, r *http.Request) {
	// CORS Headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Route based on path
	path := r.URL.Path
	if strings.Contains(path, "/status") {
		getSystemStatus(w, r)
	} else if strings.Contains(path, "/mode") {
		if r.Method == "POST" {
			setSystemMode(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	} else {
		// Default to status
		getSystemStatus(w, r)
	}
}

func getSystemStatus(w http.ResponseWriter, r *http.Request) {
	// Generate dynamic data for serverless environment
	now := time.Now()
	rand.Seed(now.UnixNano())

	// Read mode from query parameter (default to realtime)
	requestedMode := r.URL.Query().Get("mode")
	if requestedMode == "" {
		requestedMode = "realtime"
	}

	status := SystemStatus{
		SystemMode:     requestedMode,
		LastUpdateTime: now,
		QuantumKeyPool: 100 + rand.Intn(50),
		ActiveChannels: 5,
		BlockchainData: BlockchainStatus{
			BlockHeight:      int(now.Unix() / 60),
			LastBlockTime:    now.Add(-time.Duration(rand.Intn(10)) * time.Second),
			ActiveValidators: 5,
			TransactionCount: rand.Intn(5000),
			NetworkStatus:    "active",
		},
		AIMetrics: AIMetrics{
			ThreatDetectionAccuracy: 98.5 + (rand.Float64() * 1.5),
			AnomalyDetectionRate:    95.2 + (rand.Float64() * 2.1),
			ResponseTime:            0.2 + (rand.Float64() * 0.1),
			LearningProgress:        87.3 + (rand.Float64() * 5.0),
			ActiveThreats:           rand.Intn(2),
			ResolvedThreats:         rand.Intn(10),
		},
	}

	// Adjust metrics for scenario mode
	if requestedMode == "scenario" {
		status.BlockchainData.NetworkStatus = "under_attack"
		status.AIMetrics.ActiveThreats = 2 + rand.Intn(3)
		status.QuantumKeyPool = 50 + rand.Intn(30)
	}

	// Add mock satellites
	for i := 1; i <= 5; i++ {
		status.Satellites = append(status.Satellites, Satellite{
			ID:            fmt.Sprintf("SAT-%03d", i),
			Name:          fmt.Sprintf("ThunderBird-%d", i),
			OrbitType:     "LEO",
			Altitude:      float64(500 + rand.Intn(100)),
			Inclination:   float64(45 + rand.Intn(10)),
			Position:      Position{X: rand.Float64() * 1000, Y: rand.Float64() * 1000, Z: rand.Float64() * 1000},
			LastContact:   now,
			QuantumKeyID:  fmt.Sprintf("QK%d", rand.Intn(1000)),
			KeyGeneration: now.Add(-time.Hour),
			Status:        "operational",
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

func setSystemMode(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Mode string `json:"mode"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// In serverless, we can't persist the mode easily without a DB
	// So we just return success
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"mode":   request.Mode,
		"note":   "Serverless mode change simulated",
	})
}
