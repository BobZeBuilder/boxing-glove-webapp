"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SerialData } from "@/hooks/use-serial-data"
import { BarChart2, Flame, Trophy, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface WorkoutSummaryProps {
  data: SerialData | null
}

export function WorkoutSummary({ data }: WorkoutSummaryProps) {
  const [sessionTime, setSessionTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [peakHeartRate, setPeakHeartRate] = useState(0)

  // Start timer when data is received
  useEffect(() => {
    if (data && !isActive) {
      setIsActive(true)
    }

    // Update peak heart rate
    if (data && data.heartRate > peakHeartRate) {
      setPeakHeartRate(data.heartRate)
    }
  }, [data, isActive, peakHeartRate])

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  // Calculate calories burned
  useEffect(() => {
    if (data) {
      // Simple calorie calculation based on heart rate
      // MET value for boxing ranges from 6-12 depending on intensity
      const MET = 8 + (data.heartRate - 70) / 20 // Adjust MET based on heart rate
      const weight = 70 // Default weight in kg (can be replaced with user profile data)
      const hourlyCalories = (MET * weight * 3.5) / 200
      const minuteCalories = hourlyCalories / 60

      setCaloriesBurned((prev) => prev + minuteCalories / 60) // Add calories for each second
    }
  }, [data, sessionTime])

  // Format session time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="bg-boxing-card border-boxing-border">
      <CardHeader className="border-b border-boxing-border">
        <CardTitle className="flex items-center text-gold">
          <Trophy className="mr-2 h-5 w-5 text-gold" />
          Workout Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between p-3 bg-boxing-background rounded-md border border-boxing-border">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gold mr-2" />
            <span className="text-gold-light">Duration</span>
          </div>
          <span className="text-xl font-medium text-gold">{formatTime(sessionTime)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-boxing-background rounded-md border border-boxing-border">
          <div className="flex items-center">
            <Flame className="h-5 w-5 text-gold mr-2" />
            <span className="text-gold-light">Calories</span>
          </div>
          <span className="text-xl font-medium text-gold">{Math.round(caloriesBurned)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-boxing-background rounded-md border border-boxing-border">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-gold mr-2" />
            <span className="text-gold-light">Punches</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-boxing-background rounded-md border border-boxing-border">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gold mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-gold-light">Peak HR</span>
          </div>
          <span className="text-xl font-medium text-gold">{peakHeartRate} BPM</span>
        </div>

        <div className="p-3 bg-boxing-background rounded-md border border-boxing-border">
          <div className="text-sm text-gold font-medium mb-1">Workout Intensity</div>
          <div className="text-sm text-gold-light">
            {data && data.heartRate > 160
              ? "High Intensity - Great work!"
              : data && data.heartRate > 130
                ? "Moderate Intensity - Good pace!"
                : data && data.heartRate > 100
                  ? "Light Intensity - Keep it up!"
                  : "Warming up - Get ready!"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
