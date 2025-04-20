"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export type ConnectionStatusType = "disconnected" | "connecting" | "connected" | "error"

export interface SerialData {
  heartRate: number
  fsrIndex: number
  fsrMiddle: number
  fsrImpact: number
  accelerometer: {
    x: number
    y: number
    z: number
  }
  punchCount: number
  timestamp: string
}

interface RawMessage {
  type: "data" | "status" | "error"
  content: any
  timestamp: string
}

export function useSerialData() {
  const [data, setData] = useState<SerialData | null>(null)
  const [rawMessages, setRawMessages] = useState<RawMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const [isMockActive, setIsMockActive] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add a message to the raw messages log
  const addRawMessage = useCallback((type: "data" | "status" | "error", content: any) => {
    setRawMessages((prev) => {
      // Keep only the last 100 messages to prevent memory issues
      const newMessages = [
        ...prev,
        {
          type,
          content,
          timestamp: new Date().toISOString(),
        },
      ]

      if (newMessages.length > 100) {
        return newMessages.slice(-100)
      }

      return newMessages
    })
  }, [])

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      setConnectionStatus("connecting")
      setError(null)

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close()
      }

      // In a real app, this would be an environment variable or config
      const wsUrl = "ws://localhost:3001"
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("WebSocket connected")
        setConnectionStatus("connected")
        addRawMessage("status", "WebSocket connected")
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)

          if (message.type === "data") {
            setData(message.data)
            addRawMessage("data", message.data)
          } else if (message.type === "status") {
            addRawMessage("status", message)

            if (message.connected) {
              setConnectionStatus("connected")
            } else {
              setConnectionStatus("disconnected")
            }
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
          addRawMessage("error", `Parse error: ${err instanceof Error ? err.message : String(err)}`)
        }
      }

      ws.onerror = (event) => {
        console.error("WebSocket error:", event)
        setConnectionStatus("error")
        setError("WebSocket connection error")
        addRawMessage("error", "WebSocket error")
      }

      ws.onclose = () => {
        console.log("WebSocket closed")
        setConnectionStatus("disconnected")
        addRawMessage("status", "WebSocket closed")
        wsRef.current = null
      }
    } catch (err) {
      console.error("Failed to connect:", err)
      setConnectionStatus("error")
      setError(`Connection failed: ${err instanceof Error ? err.message : String(err)}`)
      addRawMessage("error", `Connection failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [addRawMessage])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setConnectionStatus("disconnected")
      addRawMessage("status", "Disconnected by user")
    }

    // Also stop mock data if it's running
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current)
      mockIntervalRef.current = null
      setIsMockActive(false)
    }
  }, [addRawMessage])

  // Toggle mock data generation
  const toggleMockData = useCallback(() => {
    if (mockIntervalRef.current) {
      // Stop mock data
      clearInterval(mockIntervalRef.current)
      mockIntervalRef.current = null
      setIsMockActive(false)
      setConnectionStatus("disconnected")
      addRawMessage("status", "Mock data stopped")
    } else {
      // Start mock data
      setConnectionStatus("connected")
      setIsMockActive(true)
      addRawMessage("status", "Mock data started")

      mockIntervalRef.current = setInterval(() => {
        const mockData: SerialData = {
          heartRate: Math.floor(60 + Math.random() * 100),
          fsrIndex: Math.floor(Math.random() * 1024),
          fsrMiddle: Math.floor(Math.random() * 1024),
          fsrImpact: Math.floor(Math.random() * 1024),
          accelerometer: {
            x: Math.floor(Math.random() * 200 - 100) / 10,
            y: Math.floor(Math.random() * 200 - 100) / 10,
            z: Math.floor(Math.random() * 200 - 100) / 10,
          },
          punchCount: data ? data.punchCount + (Math.random() > 0.7 ? 1 : 0) : Math.floor(Math.random() * 10),
          timestamp: new Date().toISOString(),
        }

        setData(mockData)
        addRawMessage("data", mockData)
      }, 1000)
    }
  }, [addRawMessage, data])

  // Send a command to the server
  const sendCommand = useCallback(
    (command: string, params?: any) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          type: "command",
          command,
          params,
        })

        wsRef.current.send(message)
        addRawMessage("status", { command, params })
        return true
      }

      return false
    },
    [addRawMessage],
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }

      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current)
      }
    }
  }, [])

  return {
    data,
    rawMessages,
    connectionStatus,
    error,
    isMockActive,
    connect,
    disconnect,
    toggleMockData,
    sendCommand,
  }
}
