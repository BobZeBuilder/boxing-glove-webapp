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
let parser
let mockInterval = null
let isConnected = false

// Function to initialize serial port
function initSerialPort() {
  try {
    console.log(`Attempting to connect to serial port ${SERIAL_PORT} at ${BAUD_RATE} baud...`);
    
    // Close existing port if it exists
    if (serialPort && serialPort.isOpen) {
      serialPort.close();
    }
    
    serialPort = new SerialPort({
      path: SERIAL_PORT,
      baudRate: BAUD_RATE,
      autoOpen: true
    });

    // On "open", handle setup
    serialPort.on("open", () => {
      console.log(`Serial port ${SERIAL_PORT} opened`);
      
      // Create parser for incoming data - IMPORTANT: Do this before DTR handling
      parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));
      
      // Set up the data handler first
      parser.on("data", data => {
        console.log("Received data:", data);
        
        // Skip empty lines
        if (!data || data.trim() === "") return;
        
        try {
          // Try to parse the data as JSON
          const parsedData = JSON.parse(data);
          
          // Convert accelerometer string values to numbers if needed
          if (parsedData.accelerometer) {
            if (typeof parsedData.accelerometer.x === 'string') parsedData.accelerometer.x = parseFloat(parsedData.accelerometer.x);
            if (typeof parsedData.accelerometer.y === 'string') parsedData.accelerometer.y = parseFloat(parsedData.accelerometer.y);
            if (typeof parsedData.accelerometer.z === 'string') parsedData.accelerometer.z = parseFloat(parsedData.accelerometer.z);
          }
          
          // Log clean data for debugging
          console.log("Parsed data:", JSON.stringify(parsedData));
          
          // Broadcast to clients
          broadcastData(parsedData);
        } catch (err) {
          // If not valid JSON, log the error and raw data
          console.error("JSON parse error:", err.message);
          console.log("Raw data:", data);
          
          // Try to recover from malformed JSON by examining the data
          if (data.includes("fsrIndex") && data.includes("accelerometer")) {
            try {
              // Attempt to repair common JSON issues
              const cleanedData = data.replace(/\s+/g, ' ').trim();
              console.log("Attempting to fix JSON:", cleanedData);
              const fixedData = cleanedData.replace(/'/g, '"');
              const parsedData = JSON.parse(fixedData);
              broadcastData(parsedData);
            } catch (fixErr) {
              // If repair fails, send as raw data
              broadcastData({ raw: data, error: "Invalid JSON format" });
            }
          } else {
            broadcastData({ raw: data, error: "Invalid data format" });
          }
        }
      });
      
      // Now handle DTR reset - AFTER parser has been set up
      console.log("Waiting 1 second before DTR reset...");
      setTimeout(() => {
        // 1. Assert DTR to trigger reset
        serialPort.set({ dtr: true }, err => {
          if (err) {
            console.error("Failed to assert DTR:", err.message);
            broadcastStatus(false, `DTR assertion failed: ${err.message}`);
          } else {
            console.log("DTR asserted, resetting Arduino…");
      
            // 2. After ~100 ms, release DTR so sketch can run
            setTimeout(() => {
              serialPort.set({ dtr: false }, err2 => {
                if (err2) {
                  console.error("Failed to release DTR:", err2.message);
                  broadcastStatus(false, `DTR release failed: ${err2.message}`);
                } else {
                  console.log("DTR released, sketch should be running now");
                  isConnected = true;
                  broadcastStatus(true, `Connected to ${SERIAL_PORT}`);
                  
                  // Send a character to kickstart communication (optional)
                  setTimeout(() => {
                    serialPort.write('\n');
                    console.log("Sent newline to kickstart communication");
                  }, 500);
                }
              });
            }, 100);
          }
        });
      }, 1000); // Wait a full second before doing DTR reset
    });

    serialPort.on("error", err => {
      console.error("Serial error:", err.message);
      isConnected = false;
      broadcastStatus(false, `Serial error: ${err.message}`);
    });
    
    serialPort.on("close", () => {
      console.log("Serial port closed");
      isConnected = false;
      broadcastStatus(false, "Serial port disconnected");
    });
  } catch (err) {
    console.error("Failed to initialize serial port:", err.message);
    broadcastStatus(false, `Connection failed: ${err.message}`);
  }
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
        x: (Math.floor(Math.random() * 200 - 100) / 100).toFixed(2),
        y: (Math.floor(Math.random() * 200 - 100) / 100).toFixed(2),
        z: (Math.floor(Math.random() * 200 - 100) / 100).toFixed(2),
      },
    }

    broadcastData(mockData)
  }, 1000)
}

// Function to send a command to Arduino
function sendCommandToArduino(command) {
  if (serialPort && serialPort.isOpen) {
    console.log(`Sending command to Arduino: ${command}`);
    serialPort.write(`${command}\n`, (err) => {
      if (err) {
        console.error(`Error sending command: ${err.message}`);
        return false;
      }
      return true;
    });
  } else {
    console.log("Cannot send command - serial port not open");
    return false;
  }
}

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected")
  clients.add(ws)

  // Send initial status
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
                setTimeout(() => {
                  initSerialPort();
                }, 1000);  // Give it a moment before reconnecting
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

          case "sendToArduino":
            if (data.value) {
              sendCommandToArduino(data.value);
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
    serialConnected: isConnected,
    port: SERIAL_PORT,
    baudRate: BAUD_RATE
  })
})

// List available ports endpoint
app.get("/ports", async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`WebSocket server available at ws://localhost:${PORT}`)

  // Wait a moment before trying to connect to the serial port
  console.log("Waiting 2 seconds before attempting serial connection...");
  setTimeout(() => {
    // Try to initialize serial port
    initSerialPort();
  
    // If serial port fails, suggest using mock data after a delay
    setTimeout(() => {
      if (!isConnected) {
        console.log("Serial port not available or not receiving data, mock data can be enabled from the UI");
        console.log("You can also try the reconnect command from the UI");
      }
    }, 5000);
  }, 2000);
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