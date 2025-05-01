"use client"

import { createContext, useContext } from "react"
import { useSerialData } from "@/hooks/use-serial-data"

const SerialContext = createContext<ReturnType<typeof useSerialData> | null>(null)

export function SerialProvider({ children }: { children: React.ReactNode }) {
  const serial = useSerialData()
  return <SerialContext.Provider value={serial}>{children}</SerialContext.Provider>
}

export function useSerial() {
  const context = useContext(SerialContext)
  if (!context) {
    throw new Error("useSerial must be used within SerialProvider")
  }
  return context
}
