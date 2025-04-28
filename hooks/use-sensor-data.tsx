"use client"

import { useState, useEffect } from "react"

interface SensorData {
  force: {
    index: number
    middle: number
    impact: number
  }
  heartRate: {
    current: number
    zone: string
  }
  movement: {
    speed: number
    acceleration: number
    punchesDetected: number
  }
  punchCount: number
  timestamp: string
}

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real implementation, this would connect to the backend
    // For demo purposes, we'll generate mock data
    let eventSource: EventSource | null = null

    try {
      // Try to connect to the real backend if available
      const connectToRealBackend = () => {
        try {
          eventSource = new EventSource("http://localhost:3001/api/stream")

          eventSource.onopen = () => {
            setIsConnected(true)
            setError(null)
          }

          eventSource.onmessage = (event) => {
            try {
              const parsedData = JSON.parse(event.data)
              setData(parsedData)
            } catch (err) {
              console.error("Error parsing data:", err)
            }
          }

          eventSource.onerror = () => {
            eventSource?.close()
            setIsConnected(false)
            setError("Connection to sensor data failed")

            // Fall back to mock data
            startMockDataGeneration()
          }
        } catch (err) {
          console.error("Failed to connect to backend:", err)
          startMockDataGeneration()
        }
      }

      // Generate mock data for demo purposes
      const startMockDataGeneration = () => {
        console.log("Using mock data generation")
        setIsConnected(true)

        const interval = setInterval(() => {
          const mockData: SensorData = {
            force: {
              index: Math.floor(Math.random() * 100),
              middle: Math.floor(Math.random() * 100),
              impact: Math.floor(Math.random() * 100),
            },
            heartRate: {
              current: Math.floor(120 + Math.random() * 60),
              zone: getHeartRateZone(Math.floor(120 + Math.random() * 60)),
            },
            movement: {
              speed: Math.floor(Math.random() * 30),
              acceleration: Math.floor(Math.random() * 20),
              punchesDetected: Math.floor(Math.random() * 5),
            },
            punchCount: data ? data.punchCount + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 10),
            timestamp: new Date().toISOString(),
          }

          setData(mockData)
        }, 1000)

        return interval
      }

      // Try to connect to real backend first
      connectToRealBackend()

      // If that fails, fall back to mock data
      const mockInterval = setTimeout(() => {
        if (!isConnected) {
          startMockDataGeneration()
        }
      }, 3000)

      return () => {
        clearTimeout(mockInterval)
        if (eventSource) {
          eventSource.close()
        }
      }
    } catch (err) {
      console.error("Error in sensor data hook:", err)
      setError("Failed to initialize sensor data connection")
      setIsConnected(false)
    }
  }, [])

  function getHeartRateZone(heartRate: number) {
    if (heartRate < 60) return "Resting"
    if (heartRate < 110) return "Warm Up"
    if (heartRate < 140) return "Fat Burn"
    if (heartRate < 170) return "Cardio"
    return "Peak"
  }

  return { data, isConnected, error }
}
