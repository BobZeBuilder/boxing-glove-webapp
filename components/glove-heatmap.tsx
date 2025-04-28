"use client"

import { useEffect, useRef } from "react"

interface GloveHeatmapProps {
  indexForce: number
  middleForce: number
  impactForce: number
}

export function GloveHeatmap({ indexForce, middleForce, impactForce }: GloveHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the boxing glove outline
    drawGlove(ctx, canvas.width, canvas.height)

    // Draw the heat spots based on sensor data
    drawHeatSpots(ctx, canvas.width, canvas.height, indexForce, middleForce, impactForce)
  }, [indexForce, middleForce, impactForce])

  return (
    <div className="flex justify-center items-center h-[300px] w-full">
      <canvas ref={canvasRef} width={500} height={300} className="max-w-full h-auto" />
    </div>
  )
}

function drawGlove(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Set up glove dimensions
  const gloveWidth = width * 0.8
  const gloveHeight = height * 0.8
  const startX = (width - gloveWidth) / 2
  const startY = (height - gloveHeight) / 2

  // Draw the main part of the glove (the fist area)
  ctx.beginPath()
  ctx.moveTo(startX + gloveWidth * 0.3, startY)
  ctx.lineTo(startX + gloveWidth * 0.8, startY)
  ctx.quadraticCurveTo(startX + gloveWidth, startY, startX + gloveWidth, startY + gloveHeight * 0.3)
  ctx.lineTo(startX + gloveWidth, startY + gloveHeight * 0.7)
  ctx.quadraticCurveTo(startX + gloveWidth, startY + gloveHeight, startX + gloveWidth * 0.8, startY + gloveHeight)
  ctx.lineTo(startX + gloveWidth * 0.3, startY + gloveHeight)
  ctx.quadraticCurveTo(
    startX + gloveWidth * 0.1,
    startY + gloveHeight,
    startX + gloveWidth * 0.1,
    startY + gloveHeight * 0.7,
  )
  ctx.lineTo(startX + gloveWidth * 0.1, startY + gloveHeight * 0.3)
  ctx.quadraticCurveTo(startX + gloveWidth * 0.1, startY, startX + gloveWidth * 0.3, startY)
  ctx.closePath()

  // Draw the wrist part
  ctx.moveTo(startX + gloveWidth * 0.1, startY + gloveHeight * 0.4)
  ctx.lineTo(startX, startY + gloveHeight * 0.4)
  ctx.lineTo(startX, startY + gloveHeight * 0.6)
  ctx.lineTo(startX + gloveWidth * 0.1, startY + gloveHeight * 0.6)

  // Set glove style
  ctx.strokeStyle = "#FFD700"
  ctx.lineWidth = 2
  ctx.stroke()

  // Add some details to the glove
  ctx.beginPath()
  ctx.moveTo(startX + gloveWidth * 0.3, startY + gloveHeight * 0.3)
  ctx.lineTo(startX + gloveWidth * 0.3, startY + gloveHeight * 0.7)
  ctx.moveTo(startX + gloveWidth * 0.5, startY + gloveHeight * 0.2)
  ctx.lineTo(startX + gloveWidth * 0.5, startY + gloveHeight * 0.8)
  ctx.moveTo(startX + gloveWidth * 0.7, startY + gloveHeight * 0.3)
  ctx.lineTo(startX + gloveWidth * 0.7, startY + gloveHeight * 0.7)
  ctx.strokeStyle = "#FFD700"
  ctx.lineWidth = 1
  ctx.stroke()

  // Add labels for the sensors
  ctx.font = "12px Arial"
  ctx.fillStyle = "#FFFFFF"
  ctx.fillText("Index", startX + gloveWidth * 0.3, startY + gloveHeight * 0.15)
  ctx.fillText("Middle", startX + gloveWidth * 0.5, startY + gloveHeight * 0.15)
  ctx.fillText("Impact", startX + gloveWidth * 0.8, startY + gloveHeight * 0.15)
}

function drawHeatSpots(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  indexForce: number,
  middleForce: number,
  impactForce: number,
) {
  // Set up glove dimensions
  const gloveWidth = width * 0.8
  const gloveHeight = height * 0.8
  const startX = (width - gloveWidth) / 2
  const startY = (height - gloveHeight) / 2

  // Draw heat spot for index finger
  const indexX = startX + gloveWidth * 0.3
  const indexY = startY + gloveHeight * 0.5
  drawHeatSpot(ctx, indexX, indexY, indexForce)

  // Draw heat spot for middle finger
  const middleX = startX + gloveWidth * 0.5
  const middleY = startY + gloveHeight * 0.5
  drawHeatSpot(ctx, middleX, middleY, middleForce)

  // Draw heat spot for impact sensor
  const impactX = startX + gloveWidth * 0.9
  const impactY = startY + gloveHeight * 0.5
  drawHeatSpot(ctx, impactX, impactY, impactForce)
}

function drawHeatSpot(ctx: CanvasRenderingContext2D, x: number, y: number, intensity: number) {
  // Normalize intensity to 0-1
  const normalizedIntensity = intensity / 100

  // Calculate radius based on intensity (bigger spot for higher intensity)
  const maxRadius = 40
  const radius = maxRadius * Math.max(0.2, normalizedIntensity)

  // Create gradient
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

  // Calculate color based on intensity (gold to red)
  const r = Math.min(255, 255)
  const g = Math.min(255, Math.floor(215 * (1 - normalizedIntensity)))
  const b = Math.min(255, 0)
  const a = Math.min(0.8, 0.2 + normalizedIntensity * 0.6)

  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`)
  gradient.addColorStop(1, "rgba(255, 215, 0, 0)")

  // Draw the heat spot
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Add force percentage text
  ctx.font = "12px Arial"
  ctx.fillStyle = "#FFFFFF"
  ctx.textAlign = "center"
  ctx.fillText(`${intensity}%`, x, y)
}
