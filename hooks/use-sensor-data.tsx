"use client"

import { useState, useEffect, useRef } from "react"

type SerialData = {
  fsrIndex?: number
  fsrMiddle?: number
  fsrImpact?: number
  accelerometer?: {
    x: number
    y: number
    z: number
  }
  heartRate?: number
  confidence?: number
  SpO2?: number
}

type ConnectionStatus = "connected" | "disconnected" | "error" | "connecting"

export function useSerialData() {
  const [data, setData] = useState<SerialData | null>(null)
  const [rawMessages, setRawMessages] = useState<string[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  // Helper to add raw message for debugging
  function addRawMessage(type: string, message: string) {
    const formatted = `[${type.toUpperCase()}] ${message}`
    setRawMessages((prev) => [...prev.slice(-50), formatted]) // Keep last 50 messages
  }

  // Connect WebSocket
  const connect = () => {
    if (socketRef.current) {
      socketRef.current.close()
    }

    setConnectionStatus("connecting")
    setError(null)

    const ws = new WebSocket("ws://localhost:3001")
    socketRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
      setConnectionStatus("connected")
      addRawMessage("status", "WebSocket connected")
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data)

        if (message.type === "data") {
          setData(message.data)
          addRawMessage("data", event.data)
        } else if (message.type === "status") {
          addRawMessage("status", message.message || "Status update")
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err)
        addRawMessage("error", "Failed to parse message")
      }
    }

    ws.onerror = (event: Event) => {
      console.error("WebSocket error:", event)
      setConnectionStatus("error")
      setError("WebSocket connection error")
      addRawMessage("error", "WebSocket error")
    }

    ws.onclose = (event: CloseEvent) => {
      console.warn("WebSocket closed:", event)
      setConnectionStatus("disconnected")
      addRawMessage("status", "WebSocket disconnected")
    }
  }

  // Disconnect WebSocket
  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
    setConnectionStatus("disconnected")
  }

  // Toggle mock data via WebSocket
  const toggleMockData = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "command", command: "toggleMock" }))
    }
  }

  // Connect on first mount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [])

  return { data, rawMessages, connectionStatus, error, connect, disconnect, toggleMockData }
}
