"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"

interface HeartRateChartProps {
  heartRate: number
}

interface HeartRateDataPoint {
  time: string
  value: number
  zone: string
}

export function HeartRateChart({ heartRate }: HeartRateChartProps) {
  const [heartRateData, setHeartRateData] = useState<HeartRateDataPoint[]>([])
  const [maxHeartRate, setMaxHeartRate] = useState<number>(220)
  const [peakHeartRate, setPeakHeartRate] = useState<number>(0)
  const [pulsing, setPulsing] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Load user profile from localStorage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem("boxingProfile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      if (profile.age) {
        setMaxHeartRate(220 - Number.parseInt(profile.age))
      }
    }
  }, [])

  // Update heart rate data
  useEffect(() => {
    if (typeof window === "undefined" || heartRate <= 0) return
  
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  
    const percentage = (heartRate / maxHeartRate) * 100
    let zone = "Rest"
    if (percentage < 50) zone = "Rest"
    else if (percentage < 60) zone = "Light"
    else if (percentage < 70) zone = "Moderate"
    else if (percentage < 80) zone = "Hard"
    else zone = "Maximum"
  
    if (heartRate > peakHeartRate) {
      setPeakHeartRate(heartRate)
    }
  
    setHeartRateData((prev) => {
      const newData = [...prev, { time: timeStr, value: heartRate, zone }]
      return newData.slice(-30)
    })
  }, [heartRate, maxHeartRate, peakHeartRate])

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 100)
    }, 60000 / Math.max(30, heartRate)) // Convert BPM to milliseconds

    return () => clearInterval(interval)
  }, [heartRate])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-boxing-background p-2 border border-gold rounded-md">
          <p className="text-gold font-medium">{`${data.value} BPM`}</p>
          <p className="text-gold-light text-xs">{`Zone: ${data.zone}`}</p>
          <p className="text-gold-light text-xs">{`Time: ${data.time}`}</p>
        </div>
      )
    }
    return null
  }

  // Get color for heart rate zone
  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "Rest":
        return "#4ade80" // green
      case "Light":
        return "#22d3ee" // cyan
      case "Moderate":
        return "#fcd34d" // yellow
      case "Hard":
        return "#fb923c" // orange
      case "Maximum":
        return "#ef4444" // red
      default:
        return "#4ade80"
    }
  }

  // Calculate zone thresholds
  const zoneThresholds = {
    light: Math.round(maxHeartRate * 0.5),
    moderate: Math.round(maxHeartRate * 0.6),
    hard: Math.round(maxHeartRate * 0.7),
    maximum: Math.round(maxHeartRate * 0.8),
  }

  return (
    <div className="relative">
      <div
        ref={chartRef}
        className={`absolute top-0 left-0 w-full h-full rounded-md ${pulsing ? "bg-boxing-border opacity-10" : "opacity-0"} transition-opacity duration-100`}
      />

      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-xs text-gold-light mr-2">Rest</span>

          <div className="w-3 h-3 rounded-full bg-cyan-500 mr-1"></div>
          <span className="text-xs text-gold-light mr-2">Light</span>

          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-xs text-gold-light mr-2">Moderate</span>

          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
          <span className="text-xs text-gold-light mr-2">Hard</span>

          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-xs text-gold-light">Maximum</span>
        </div>

        <div className="text-gold-light text-xs">
          Peak: <span className="text-gold font-medium">{peakHeartRate} BPM</span>
        </div>
      </div>

      <Card className="bg-boxing-background border-boxing-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-gold">
              {heartRate} <span className="text-xl">BPM</span>
            </div>
            <div className="text-sm text-gold-light">Max HR: {maxHeartRate} BPM</div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#ffd700", fontSize: 10 }}
                  stroke="#333"
                  tickLine={{ stroke: "#333" }}
                />
                <YAxis
                  domain={[0, maxHeartRate + 10]}
                  tick={{ fill: "#ffd700", fontSize: 10 }}
                  stroke="#333"
                  tickLine={{ stroke: "#333" }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Zone reference lines */}
                <ReferenceLine y={zoneThresholds.light} stroke="#22d3ee" strokeDasharray="3 3" />
                <ReferenceLine y={zoneThresholds.moderate} stroke="#fcd34d" strokeDasharray="3 3" />
                <ReferenceLine y={zoneThresholds.hard} stroke="#fb923c" strokeDasharray="3 3" />
                <ReferenceLine y={zoneThresholds.maximum} stroke="#ef4444" strokeDasharray="3 3" />

                {/* Peak heart rate reference line */}
                {peakHeartRate > 0 && (
                  <ReferenceLine
                    y={peakHeartRate}
                    stroke="#ffd700"
                    strokeDasharray="3 3"
                    label={{
                      value: `Peak: ${peakHeartRate}`,
                      position: "insideTopRight",
                      fill: "#ffd700",
                      fontSize: 10,
                    }}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ffd700"
                  strokeWidth={2}
                  dot={(props) => {
                    const zone = props.payload.zone
                    return (
                      <circle
                        key={`dot-${props.index || props.payload.time}`}
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill={getZoneColor(zone)}
                        stroke="#ffd700"
                        strokeWidth={1}
                      />
                    )
                  }}                  
                  activeDot={{ r: 6, fill: "#ffd700" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
