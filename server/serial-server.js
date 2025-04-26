const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const express = require("express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const cors = require("cors");

// Create Express app
const app = express()
app.use(cors())
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Track connected clients
const clients = new Set()

// Serial port configuration
const PORT = process.env.PORT || 3001
const SERIAL_PORT = process.env.SERIAL_PORT || "/dev/cu.usbmodem123456781" // Change this to match your Arduino port
const BAUD_RATE = Number.parseInt(process.env.BAUD_RATE || "115200", 10)

let serialPort
let mockInterval = null

// Function to initialize serial port
function initSerialPort() {
  serialPort = new SerialPort({
    path: SERIAL_PORT,
    baudRate: BAUD_RATE
  });

  // On "open", we had to assert the DTR: which was the BUG that forced us to use the Arduino-IDE
  serialPort.on("open", () => {
    console.log(`Serial port ${SERIAL_PORT} opened`);

    // 1. assert DTR:
    serialPort.set({ dtr: true }, err => {
      if (err) console.error("Failed to assert DTR:", err.message);
      else console.log("DTR asserted");
    });

    // 2. DTR is high -> so attach the parser:
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));
    parser.on("data", data => {
      try {
        // Try to parse as JSON
        const jsonData = JSON.parse(data)
        broadcastData(jsonData)
      } catch (err) {
        // If not valid JSON, send as raw data
        console.log("Raw data:", data)
        broadcastData({ raw: data.trim() })
      }
      // console.log("Received", data);
    });

    // 3. Any other on-open logic (status notifications, clearing mocks…)
  });

  serialPort.on("error", err => {
    console.error("Serial error:", err.message);
  });
  serialPort.on("close", () => {
    console.log("Serial port closed");
  });
}


// Function to broadcast data to all connected clients
function broadcastData(data) {
  const message = JSON.stringify({
    type: "data",
    data: data,
    timestamp: new Date().toISOString(),
  })

  for (const client of clients) {
    if (client.readyState === 1) {
      // OPEN
      client.send(message)
    }
  }
}

// Function to broadcast status to all connected clients
function broadcastStatus(connected, message) {
  const status = JSON.stringify({
    type: "status",
    connected: connected,
    message: message,
    timestamp: new Date().toISOString(),
  })

  for (const client of clients) {
    if (client.readyState === 1) {
      // OPEN
      client.send(status)
    }
  }
}

// Function to generate mock data for testing
function startMockData() {
  if (mockInterval) {
    clearInterval(mockInterval)
  }

  console.log("Starting mock data generation")
  broadcastStatus(true, "Using mock data")

  mockInterval = setInterval(() => {
    const mockData = {
      heartRate: Math.floor(60 + Math.random() * 100),
      fsrIndex: Math.floor(Math.random() * 1024),
      fsrMiddle: Math.floor(Math.random() * 1024),
      fsrImpact: Math.floor(Math.random() * 1024),
      accelerometer: {
        x: Math.floor(Math.random() * 200 - 100) / 10,
        y: Math.floor(Math.random() * 200 - 100) / 10,
        z: Math.floor(Math.random() * 200 - 100) / 10,
      },
      punchCount: Math.floor(Math.random() * 50),
    }

    broadcastData(mockData)
  }, 1000)
}

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected")
  clients.add(ws)

  // Send initial status
  const isConnected = serialPort && serialPort.isOpen
  ws.send(
    JSON.stringify({
      type: "status",
      connected: isConnected,
      message: isConnected ? `Connected to ${SERIAL_PORT}` : "Waiting for device",
      timestamp: new Date().toISOString(),
    }),
  )

  // Handle client messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString())

      if (data.type === "command") {
        console.log("Received command:", data.command)

        // Handle commands
        switch (data.command) {
          case "reconnect":
            // Try to reconnect to serial port
            if (serialPort) {
              serialPort.close(() => {
                initSerialPort()
              })
            } else {
              initSerialPort()
            }
            break

          case "toggleMock":
            if (mockInterval) {
              clearInterval(mockInterval)
              mockInterval = null
              broadcastStatus(false, "Mock data stopped")
            } else {
              startMockData()
            }
            break

          default:
            console.log("Unknown command:", data.command)
        }
      }
    } catch (err) {
      console.error("Error processing message:", err)
    }
  })

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected")
    clients.delete(ws)
  })
})

// Status endpoint
app.get("/status", (req, res) => {
  res.json({
    status: "running",
    clients: clients.size,
    serialConnected: serialPort && serialPort.isOpen,
  })
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`WebSocket server available at ws://localhost:${PORT}`)

  // Try to initialize serial port
  initSerialPort()

  // If serial port fails, start mock data after a delay
  setTimeout(() => {
    if (!serialPort || !serialPort.isOpen) {
      console.log("Serial port not available, mock data can be enabled from the UI")
    }
  }, 3000)
})

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...")

  if (mockInterval) {
    clearInterval(mockInterval)
  }

  if (serialPort && serialPort.isOpen) {
    serialPort.close()
  }

  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})
