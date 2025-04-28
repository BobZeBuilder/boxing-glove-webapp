"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Dumbbell, BarChart3 } from "lucide-react"
import { GloveHeatmap } from "@/components/glove-heatmap"
import { HeartRateChart } from "@/components/heart-rate-chart"
import { ForceDistributionChart } from "@/components/force-distribution-chart"
import { useSensorData } from "@/hooks/use-sensor-data"

export default function DashboardPage() {
  const { data, isConnected } = useSensorData()
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isConnected) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-gold">Performance Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex h-8 items-center rounded-full bg-green-500/20 px-3">
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="ml-2 text-sm text-white">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
            <Button variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold/10">
              Start Session
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="border-gold/20 bg-black text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Session Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-gold">{formatTime(sessionTime)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Punches Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-gold">{data?.punchCount || 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Max Force
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-gold">
                  {Math.max(data?.force?.index || 0, data?.force?.middle || 0, data?.force?.impact || 0)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="border-gold/20 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-gold">Glove Force Heatmap</CardTitle>
              <CardDescription className="text-white/70">Real-time force distribution visualization</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <GloveHeatmap
                indexForce={data?.force?.index || 0}
                middleForce={data?.force?.middle || 0}
                impactForce={data?.force?.impact || 0}
              />
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-gold">Heart Rate</CardTitle>
              <CardDescription className="text-white/70">
                Current: {data?.heartRate?.current || 0} BPM - Zone: {data?.heartRate?.zone || "Resting"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeartRateChart heartRate={data?.heartRate?.current || 0} />
            </CardContent>
          </Card>
        </div>

        <Card className="border-gold/20 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-gold">Force Distribution</CardTitle>
            <CardDescription className="text-white/70">Real-time force readings from all sensors</CardDescription>
          </CardHeader>
          <CardContent>
            <ForceDistributionChart
              indexForce={data?.force?.index || 0}
              middleForce={data?.force?.middle || 0}
              impactForce={data?.force?.impact || 0}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
