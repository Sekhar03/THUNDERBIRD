// thunderbird heart
// core implementation @exprays
// MIT License
// © 2021 TheStarSociety

package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

// Config represents the system configuration
type Config struct {
	SimulatorAddress  string
	QuantumServiceURL string
	SystemMode        string
	Port              string
}

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

// AIMetrics represents AI system metrics
type AIMetrics struct {
	ThreatDetectionAccuracy float64 `json:"threatDetectionAccuracy"`
	AnomalyDetectionRate    float64 `json:"anomalyDetectionRate"`
	ResponseTime            float64 `json:"responseTime"`
	LearningProgress        float64 `json:"learningProgress"`
	ActiveThreats           int     `json:"activeThreats"`
	ResolvedThreats         int     `json:"resolvedThreats"`
}

var (
	config = Config{
		SimulatorAddress:  "http://localhost:9090",
		QuantumServiceURL: "http://localhost:8081",
		SystemMode:        "realtime",
		Port:              "8080",
	}
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	clients    = make(map[*websocket.Conn]bool)
	broadcast  = make(chan SystemStatus)
	systemData = SystemStatus{
		Satellites:     []Satellite{},
		BlockchainData: BlockchainStatus{},
		SystemMode:     "realtime",
		AIMetrics: AIMetrics{
			ThreatDetectionAccuracy: 98.5,
			AnomalyDetectionRate:    95.2,
			ResponseTime:            0.2,
			LearningProgress:        87.3,
			ActiveThreats:           0,
			ResolvedThreats:         0,
		},
	}
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using defaults")
	}

	// Override port from environment variable (Railway provides PORT)
	if port := os.Getenv("PORT"); port != "" {
		config.Port = port
	}

	// Override simulator address from environment variable
	if simulatorAddr := os.Getenv("SIMULATOR_URL"); simulatorAddr != "" {
		config.SimulatorAddress = simulatorAddr
	}

	// Override quantum service URL from environment variable
	if quantumURL := os.Getenv("QUANTUM_URL"); quantumURL != "" {
		config.QuantumServiceURL = quantumURL
	}

	// Set up HTTP routes with CORS middleware
	http.HandleFunc("/ws", handleConnections)
	http.HandleFunc("/api/status", corsMiddleware(getSystemStatus))
	http.HandleFunc("/api/mode", corsMiddleware(setSystemMode))

	// Start core services
	go initializeQuantumModule()
	go runBlockchainSimulator()
	go connectToSatelliteSimulator(config.SimulatorAddress)
	go runAIMonitoring()

	if config.SystemMode == "scenario" {
		go runScenarioSimulator()
	}

	// Start message handler
	go handleMessages()

	// Print startup banner
	fmt.Printf("\n🚀 ThunderBird Quantum-Secured Space Communications System\n")
	fmt.Printf("=========================================================\n")
	fmt.Printf("Mode: %s\n", config.SystemMode)
	fmt.Printf("Port: %s\n", config.Port)
	fmt.Printf("Simulator: %s\n", config.SimulatorAddress)

	// Start the server
	log.Printf("Server starting on port %s\n", config.Port)
	log.Fatal(http.ListenAndServe(":"+config.Port, nil))
}

func initializeQuantumModule() {
	fmt.Println("Initializing quantum module...")
	cmd := exec.Command("python", "./quantum/init_qiskit.py")
	err := cmd.Run()
	if err != nil {
		log.Printf("Error initializing quantum module: %v\n", err)
	}
	fmt.Println("✅ Quantum module initialized")
}

func runScenarioSimulator() {
	log.Println("📺 Starting scenario simulator...")
	scenarios := []string{
		"normal",
		"hacker_attempt",
		"authentication",
		"satellite_failure",
		"quantum_breach",
		"network_overload",
	}
	currentScenario := 0

	for {
		scenario := scenarios[currentScenario]
		log.Printf("🎬 Running scenario: %s\n", scenario)

		switch scenario {
		case "normal":
			// Normal operations for 20 seconds
			log.Println("🟢 Normal operations - All systems operational")
			simulateNormalOperations()
			time.Sleep(20 * time.Second)
		case "hacker_attempt":
			simulateHackerAttempt()
		case "authentication":
			simulateAuthentication()
		case "satellite_failure":
			simulateSatelliteFailure()
		case "quantum_breach":
			simulateQuantumBreach()
		case "network_overload":
			simulateNetworkOverload()
		}

		currentScenario = (currentScenario + 1) % len(scenarios)

		// Update system status after each scenario
		systemData.LastUpdateTime = time.Now()
		broadcast <- systemData
	}
}

func setupInteractiveConfig() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Enter satellite simulator address (default: http://localhost:9090): ")
	if addr, _ := reader.ReadString('\n'); addr != "\n" {
		config.SimulatorAddress = addr[:len(addr)-1]
	}

	fmt.Print("Select mode (realtime/scenario) [default: realtime]: ")
	if mode, _ := reader.ReadString('\n'); mode != "\n" {
		config.SystemMode = mode[:len(mode)-1]
	}

	fmt.Print("Enter server port (default: 8080): ")
	if port, _ := reader.ReadString('\n'); port != "\n" {
		config.Port = port[:len(port)-1]
	}
}

func simulateHackerAttempt() {
	log.Println("⚠️ Detecting unauthorized access attempt...")
	systemData.BlockchainData.NetworkStatus = "under_attack"
	// Simulate some satellites going offline
	for i := range systemData.Satellites {
		if rand.Float64() < 0.3 {
			systemData.Satellites[i].Status = "limited_connection"
		}
	}
	broadcast <- systemData

	time.Sleep(10 * time.Second)
	log.Println("✅ Threat mitigated")
	systemData.BlockchainData.NetworkStatus = "active"
	broadcast <- systemData
}

func simulateAuthentication() {
	log.Println("🔐 Performing quantum authentication...")
	systemData.QuantumKeyPool += 50
	for i := range systemData.Satellites {
		systemData.Satellites[i].QuantumKeyID = fmt.Sprintf("QK%d", rand.Intn(1000))
		systemData.Satellites[i].KeyGeneration = time.Now()
		systemData.Satellites[i].Status = "operational"
	}
	broadcast <- systemData
}

func simulateNormalOperations() {
	log.Println("🟢 Normal operations - All systems operational")
	// Reset all systems to normal
	systemData.BlockchainData.NetworkStatus = "active"
	systemData.QuantumKeyPool = 100 + rand.Intn(50)
	systemData.ActiveChannels = len(systemData.Satellites)

	for i := range systemData.Satellites {
		systemData.Satellites[i].Status = "operational"
	}
	broadcast <- systemData
}

func simulateSatelliteFailure() {
	log.Println("🛰️ Simulating satellite failure...")

	// Randomly select 1-2 satellites to fail
	failCount := 1 + rand.Intn(2)
	for i := 0; i < failCount && i < len(systemData.Satellites); i++ {
		satIndex := rand.Intn(len(systemData.Satellites))
		systemData.Satellites[satIndex].Status = "limited_connection"
		log.Printf("⚠️ Satellite %s experiencing connection issues", systemData.Satellites[satIndex].ID)
	}

	systemData.ActiveChannels = len(systemData.Satellites) - failCount
	broadcast <- systemData

	time.Sleep(15 * time.Second)

	// Recovery
	log.Println("✅ Satellite systems recovering...")
	for i := range systemData.Satellites {
		if systemData.Satellites[i].Status == "limited_connection" {
			systemData.Satellites[i].Status = "operational"
		}
	}
	systemData.ActiveChannels = len(systemData.Satellites)
	broadcast <- systemData
}

func simulateQuantumBreach() {
	log.Println("🔓 Quantum security breach detected...")

	// Simulate quantum key compromise
	systemData.QuantumKeyPool = 0
	systemData.BlockchainData.NetworkStatus = "compromised"

	// Some satellites go offline due to security concerns
	for i := range systemData.Satellites {
		if rand.Float64() < 0.4 {
			systemData.Satellites[i].Status = "limited_connection"
		}
	}

	broadcast <- systemData

	time.Sleep(12 * time.Second)

	// Quantum key regeneration with advanced protocols
	log.Println("🔐 Regenerating quantum keys with BB84 protocol...")
	systemData.QuantumKeyPool = 150 + rand.Intn(100)
	systemData.BlockchainData.NetworkStatus = "active"

	for i := range systemData.Satellites {
		systemData.Satellites[i].QuantumKeyID = fmt.Sprintf("QK-BB84-%d", rand.Intn(1000))
		systemData.Satellites[i].KeyGeneration = time.Now()
		systemData.Satellites[i].Status = "operational"
	}

	broadcast <- systemData
}

func simulateNetworkOverload() {
	log.Println("📡 Network overload detected...")

	// Simulate high transaction volume
	systemData.BlockchainData.TransactionCount += 500
	systemData.BlockchainData.NetworkStatus = "degraded"

	// Reduce active channels due to overload
	systemData.ActiveChannels = len(systemData.Satellites) / 2

	// Some satellites experience delays
	for i := range systemData.Satellites {
		if rand.Float64() < 0.5 {
			systemData.Satellites[i].Status = "limited_connection"
		}
	}

	broadcast <- systemData

	time.Sleep(10 * time.Second)

	// Network recovery
	log.Println("✅ Network load balancing...")
	systemData.BlockchainData.NetworkStatus = "active"
	systemData.ActiveChannels = len(systemData.Satellites)

	for i := range systemData.Satellites {
		systemData.Satellites[i].Status = "operational"
	}

	broadcast <- systemData
}

func connectToSatelliteSimulator(address string) {
	fmt.Printf("Connecting to satellite simulator at %s...\n", address)
	client := &http.Client{Timeout: 5 * time.Second}

	// Test connection
	_, err := client.Get(address + "/telemetry")
	if err != nil {
		log.Printf("Warning: Could not connect to simulator: %v\n", err)
		log.Println("Falling back to mock data")

		// Generate mock satellite data
		for i := 1; i <= 5; i++ {
			sat := Satellite{
				ID:            fmt.Sprintf("SAT-%03d", i),
				Name:          fmt.Sprintf("ThunderBird-%d", i),
				OrbitType:     "LEO",
				Altitude:      500 + float64(rand.Intn(300)),
				Inclination:   45 + float64(rand.Intn(45)),
				Position:      Position{X: rand.Float64() * 1000, Y: rand.Float64() * 1000, Z: rand.Float64() * 1000},
				LastContact:   time.Now(),
				QuantumKeyID:  fmt.Sprintf("QK%d", rand.Intn(1000)),
				KeyGeneration: time.Now(),
				Status:        "operational",
			}
			systemData.Satellites = append(systemData.Satellites, sat)
		}

		// Update satellite positions and statuses
		go func() {
			for {
				time.Sleep(2 * time.Second)
				for i := range systemData.Satellites {
					// Update position (simplified orbital mechanics)
					systemData.Satellites[i].Position.X += rand.Float64()*10 - 5
					systemData.Satellites[i].Position.Y += rand.Float64()*10 - 5
					systemData.Satellites[i].Position.Z += rand.Float64()*10 - 5

					// Occasionally update quantum key
					if rand.Intn(10) == 0 {
						systemData.Satellites[i].QuantumKeyID = fmt.Sprintf("QK%d", rand.Intn(1000))
						systemData.Satellites[i].KeyGeneration = time.Now()
					}

					systemData.Satellites[i].LastContact = time.Now()
				}

				systemData.QuantumKeyPool = 100 + rand.Intn(50)
				systemData.ActiveChannels = len(systemData.Satellites)
				systemData.LastUpdateTime = time.Now()

				broadcast <- systemData
			}
		}()

		fmt.Println("✅ Using mock satellite data")
		return
	}

	// Start periodic updates
	go func() {
		for {
			resp, err := client.Get(address + "/telemetry")
			if err == nil {
				var satellites []Satellite
				json.NewDecoder(resp.Body).Decode(&satellites)
				systemData.Satellites = satellites
				resp.Body.Close()
			}
			time.Sleep(2 * time.Second)
		}
	}()

	fmt.Println("✅ Connected to satellite simulator")
}

func runBlockchainSimulator() {
	fmt.Println("Starting polkadot network...")
	time.Sleep(2 * time.Second)

	// Initialize blockchain data
	systemData.BlockchainData = BlockchainStatus{
		BlockHeight:      1,
		LastBlockTime:    time.Now(),
		ActiveValidators: 5,
		TransactionCount: 0,
		NetworkStatus:    "active",
	}

	// Simulate blockchain activity
	go func() {
		for {
			time.Sleep(5 * time.Second)
			systemData.BlockchainData.BlockHeight++
			systemData.BlockchainData.LastBlockTime = time.Now()
			systemData.BlockchainData.TransactionCount += rand.Intn(10)
			broadcast <- systemData
		}
	}()

	fmt.Println("✅ Polkadot Blockchain running")
}

func runAIMonitoring() {
	fmt.Println("🤖 Starting AI monitoring system...")

	// Simulate AI learning and threat detection
	go func() {
		for {
			time.Sleep(10 * time.Second)

			// Update AI metrics
			systemData.AIMetrics.ThreatDetectionAccuracy = 98.0 + rand.Float64()*2.0
			systemData.AIMetrics.AnomalyDetectionRate = 94.0 + rand.Float64()*3.0
			systemData.AIMetrics.ResponseTime = 0.1 + rand.Float64()*0.3
			systemData.AIMetrics.LearningProgress = 85.0 + rand.Float64()*10.0

			// Simulate threat detection
			if rand.Float64() < 0.3 {
				systemData.AIMetrics.ActiveThreats++
				log.Println("⚠️ AI detected potential threat")
			}

			// Simulate threat resolution
			if systemData.AIMetrics.ActiveThreats > 0 && rand.Float64() < 0.5 {
				systemData.AIMetrics.ActiveThreats--
				systemData.AIMetrics.ResolvedThreats++
				log.Println("✅ AI resolved threat")
			}

			broadcast <- systemData
		}
	}()

	fmt.Println("✅ AI monitoring system active")
}

// func connectToSatelliteSimulator() {
// 	fmt.Println("Connecting to satellite simulator...")
// 	time.Sleep(2 * time.Second)

// 	// Simulate initial satellites
// 	for i := 1; i <= 5; i++ {
// 		sat := Satellite{
// 			ID:            fmt.Sprintf("SAT-%03d", i),
// 			Name:          fmt.Sprintf("ThunderBird-%d", i),
// 			OrbitType:     "LEO",
// 			Altitude:      500 + float64(rand.Intn(300)),
// 			Inclination:   45 + float64(rand.Intn(45)),
// 			Position:      Position{X: rand.Float64() * 1000, Y: rand.Float64() * 1000, Z: rand.Float64() * 1000},
// 			LastContact:   time.Now(),
// 			QuantumKeyID:  fmt.Sprintf("QK%d", rand.Intn(1000)),
// 			KeyGeneration: time.Now(),
// 			Status:        "online",
// 		}
// 		systemData.Satellites = append(systemData.Satellites, sat)
// 	}

// 	// Update satellite positions and statuses
// 	go func() {
// 		for {
// 			time.Sleep(2 * time.Second)
// 			for i := range systemData.Satellites {
// 				// Update position (simplified orbital mechanics)
// 				systemData.Satellites[i].Position.X += rand.Float64()*10 - 5
// 				systemData.Satellites[i].Position.Y += rand.Float64()*10 - 5
// 				systemData.Satellites[i].Position.Z += rand.Float64()*10 - 5

// 				// Occasionally update quantum key
// 				if rand.Intn(10) == 0 {
// 					systemData.Satellites[i].QuantumKeyID = fmt.Sprintf("QK%d", rand.Intn(1000))
// 					systemData.Satellites[i].KeyGeneration = time.Now()
// 				}

// 				systemData.Satellites[i].LastContact = time.Now()
// 			}

// 			systemData.QuantumKeyPool = 100 + rand.Intn(50)
// 			systemData.ActiveChannels = len(systemData.Satellites)
// 			systemData.LastUpdateTime = time.Now()

// 			broadcast <- systemData
// 		}
// 	}()

// 	fmt.Println("✅ Connected to satellite simulator")
// }

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	// Register new client
	clients[ws] = true

	// Send current status immediately upon connection
	ws.WriteJSON(systemData)

	for {
		// Read in a new message as JSON and map it to a Message object
		var msg map[string]interface{}
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws)
			break
		}

		// Process the message from client if needed
	}
}

func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast

		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func getSystemStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(systemData)
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next(w, r)
	}
}

func setSystemMode(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		Mode string `json:"mode"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if request.Mode != "realtime" && request.Mode != "scenario" {
		http.Error(w, "Invalid mode. Must be 'realtime' or 'scenario'", http.StatusBadRequest)
		return
	}

	// Stop existing scenario simulator if running
	if systemData.SystemMode == "scenario" && request.Mode == "realtime" {
		log.Println("Stopping scenario simulator...")
	}

	systemData.SystemMode = request.Mode
	log.Printf("Switching to %s mode\n", request.Mode)

	// Start scenario simulator if needed
	if request.Mode == "scenario" {
		go runScenarioSimulator()
	}

	broadcast <- systemData

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "success",
		"mode":   request.Mode,
	})
}
