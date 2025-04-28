"use client"

import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

interface ForceDistributionChartProps {
  indexForce: number
  middleForce: number
  impactForce: number
}

export function ForceDistributionChart({ indexForce, middleForce, impactForce }: ForceDistributionChartProps) {
  const [maxForceValues, setMaxForceValues] = useState({
    index: 0,
    middle: 0,
    impact: 0,
  })

  useEffect(() => {
    // Update max values if current values are higher
    setMaxForceValues((prev) => ({
      index: Math.max(prev.index, indexForce),
      middle: Math.max(prev.middle, middleForce),
      impact: Math.max(prev.impact, impactForce),
    }))
  }, [indexForce, middleForce, impactForce])

  // Prepare data for the chart
  const data = [
    {
      name: "Index Finger",
      current: indexForce,
      max: maxForceValues.index,
      avg: Math.floor((indexForce + maxForceValues.index) / 2),
    },
    {
      name: "Middle Finger",
      current: middleForce,
      max: maxForceValues.middle,
      avg: Math.floor((middleForce + maxForceValues.middle) / 2),
    },
    {
      name: "Impact Sensor",
      current: impactForce,
      max: maxForceValues.impact,
      avg: Math.floor((impactForce + maxForceValues.impact) / 2),
    },
  ]

  // Calculate color based on force value (0-100%)
  const getBarColor = (value: number) => {
    // Gold to red gradient based on value
    const r = 255
    const g = Math.max(0, Math.floor(215 - (value / 100) * 215))
    const b = 0
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="w-full">
      <div className="h-[300px] w-full">
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#999" tick={{ fill: "#999" }} />
              <YAxis
                domain={[0, 100]}
                stroke="#999"
                tick={{ fill: "#999" }}
                label={{
                  value: "Force (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#999",
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltip>
                        <ChartTooltipContent>
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{label}</span>
                            <span className="text-gold">Current: {payload[0].value}%</span>
                            <span className="text-blue-400">Average: {payload[1].value}%</span>
                            <span className="text-red-400">Max: {payload[2].value}%</span>
                          </div>
                        </ChartTooltipContent>
                      </ChartTooltip>
                    )
                  }
                  return null
                }}
              />
              <Legend formatter={(value) => <span className="text-white">{value}</span>} />
              <Bar dataKey="current" name="Current Force" isAnimationActive={false}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.current)} />
                ))}
              </Bar>
              <Bar dataKey="avg" name="Average Force" fill="#3b82f6" isAnimationActive={false} />
              <Bar dataKey="max" name="Max Force" fill="#ef4444" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center p-3 border border-gold/20 rounded-lg">
            <div className="text-sm text-white/70">{item.name}</div>
            <div className="text-xl font-bold text-gold">{item.current}%</div>
            <div className="text-xs text-white/50 mt-1">Max: {item.max}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
