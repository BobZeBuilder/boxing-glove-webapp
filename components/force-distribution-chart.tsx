"use client"

import { useEffect, useState } from "react"
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
    },
    {
      name: "Middle Finger",
      current: middleForce,
      max: maxForceValues.middle,
    },
    {
      name: "Impact Sensor",
      current: impactForce,
      max: maxForceValues.impact,
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
      <div className="h-[300px] w-full bg-black border border-gold/20 rounded-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#999" tick={{ fill: "#ffd700" }} />
            <YAxis domain={[0, 100]} stroke="#999" tick={{ fill: "#ffd700" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", border: "1px solid #ffd700" }}
              labelStyle={{ color: "#ffd700" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend formatter={(value) => <span style={{ color: "#ffd700" }}>{value}</span>} />
            <Bar dataKey="current" name="Current Force" isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.current)} />
              ))}
            </Bar>
            <Bar dataKey="max" name="Max Force" fill="#ef4444" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
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
