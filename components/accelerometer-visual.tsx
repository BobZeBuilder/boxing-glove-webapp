"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AccelerometerData {
  x: number
  y: number
  z: number
}

interface AccelerometerVisualProps {
  data: AccelerometerData
}

export function AccelerometerVisual({ data }: AccelerometerVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trailPoints, setTrailPoints] = useState<{ x: number; y: number }[]>([])

  // Draw the accelerometer visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Draw background
    ctx.fillStyle = "#121212"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

    // Draw grid circles
    for (let r = radius / 3; r <= radius; r += radius / 3) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // X-axis
    ctx.beginPath()
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#ffd700"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    ctx.fillText("+X", centerX + radius + 15, centerY)
    ctx.fillText("-X", centerX - radius - 15, centerY)
    ctx.fillText("+Y", centerX, centerY - radius - 15)
    ctx.fillText("-Y", centerX, centerY + radius + 15)

    // Calculate position based on accelerometer data
    // Normalize values to fit within the circle
    const scale = 5 // Scale factor to make movement more visible
    const normX = Math.max(-1, Math.min(1, data.x / scale))
    const normY = Math.max(-1, Math.min(1, data.y / scale))

    const posX = centerX + normX * radius
    const posY = centerY + normY * radius

    // Update trail points
    setTrailPoints((prev) => {
      const newPoints = [...prev, { x: posX, y: posY }]
      if (newPoints.length > 20) {
        return newPoints.slice(-20)
      }
      return newPoints
    })

    // Draw trail
    if (trailPoints.length > 1) {
      ctx.beginPath()
      ctx.moveTo(trailPoints[0].x, trailPoints[0].y)

      for (let i = 1; i < trailPoints.length; i++) {
        ctx.lineTo(trailPoints[i].x, trailPoints[i].y)
      }

      ctx.strokeStyle = "rgba(255, 215, 0, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw position dot
    ctx.beginPath()
    ctx.arc(posX, posY, 10, 0, Math.PI * 2)
    ctx.fillStyle = "#ffd700"
    ctx.fill()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw line from center to position
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(posX, posY)
    ctx.strokeStyle = "#ffd700"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw magnitude indicator
    const magnitude = Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2))
    const magnitudeText = `Magnitude: ${magnitude.toFixed(2)}`
    ctx.fillStyle = "#ffd700"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(magnitudeText, centerX, canvas.height - 10)
  }, [data, trailPoints])

  // Calculate total acceleration magnitude
  const magnitude = Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)).toFixed(2)

  return (
    <Card className="bg-boxing-background border-boxing-border">
      <CardContent className="p-4">
        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} width={280} height={280} className="border border-boxing-border rounded-md" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-2 bg-boxing-card rounded-md border border-boxing-border">
            <div className="text-sm text-gold-light">X-Axis</div>
            <div className="text-xl font-medium text-gold">{data.x.toFixed(2)}</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-boxing-card rounded-md border border-boxing-border">
            <div className="text-sm text-gold-light">Y-Axis</div>
            <div className="text-xl font-medium text-gold">{data.y.toFixed(2)}</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-boxing-card rounded-md border border-boxing-border">
            <div className="text-sm text-gold-light">Z-Axis</div>
            <div className="text-xl font-medium text-gold">{data.z.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4 p-2 bg-boxing-card rounded-md border border-boxing-border flex justify-between items-center">
          <span className="text-gold-light">Total Magnitude:</span>
          <span className="text-xl font-medium text-gold">{magnitude}</span>
        </div>
      </CardContent>
    </Card>
  )
}
