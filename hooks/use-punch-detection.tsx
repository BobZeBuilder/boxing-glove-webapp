"use client"

import { useEffect, useRef, useState } from "react"
import { SerialData } from "./use-serial-data"

export function usePunchDetection(data: SerialData | null) {
  const [punches, setPunches] = useState(0)
  const [blocks, setBlocks] = useState(0)
  const [motionState, setMotionState] = useState<"resting" | "active">("resting")

  const prevIndex = useRef(0)
  const prevMiddle = useRef(0)
  const prevImpact = useRef(0)

  useEffect(() => {
    if (!data) return

    const threshold = 200
    const accelThreshold = 0.5

    // Detect Punch (Index + Middle FSR spike)
    if (
      data.fsrIndex - prevIndex.current > threshold &&
      data.fsrMiddle - prevMiddle.current > threshold
    ) {
      setPunches((p) => p + 1)
    }

    // Detect Block (Impact FSR spike)
    if (data.fsrImpact - prevImpact.current > threshold) {
      setBlocks((b) => b + 1)
    }

    // Detect Motion vs Rest
    const { x, y, z } = data.accelerometer
    const magnitude = Math.sqrt(x * x + y * y + z * z)
    setMotionState(magnitude > 1 + accelThreshold ? "active" : "resting")

    prevIndex.current = data.fsrIndex
    prevMiddle.current = data.fsrMiddle
    prevImpact.current = data.fsrImpact
  }, [data])

  return { punches, blocks, motionState }
}
