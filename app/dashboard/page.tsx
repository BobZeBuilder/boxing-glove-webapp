"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Dumbbell, BarChart3 } from "lucide-react"
import { GloveHeatmap } from "@/components/glove-heatmap"
import { HeartRateChart } from "@/components/heart-rate-chart"
import { ForceDistributionChart } from "@/components/force-distribution-chart"
import { useSerial } from "@/components/providers/SerialProvider"
import { usePunchDetection } from "@/hooks/use-punch-detection"

export default function DashboardPage() {
  const { data, rawMessages, connectionStatus, error, connect, disconnect, toggleMockData } = useSerial()
  const [sessionTime, setSessionTime] = useState(0)
  const [age, setAge] = useState(25)
  const [weight, setWeight] = useState(70)
  const [gender, setGender] = useState<"male" | "female">("male")

  var totalPunches:number = 0;
  const { punches, blocks, motionState } = usePunchDetection(data)
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (connectionStatus) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [connectionStatus])

  useEffect(() => {
    const stored = localStorage.getItem("userProfile")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.age) setAge(parsed.age)
      if (parsed.weight) setWeight(parsed.weight)
      if (parsed.gender) setGender(parsed.gender)
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify({ age, weight, gender }))
  }, [age, weight, gender])
  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateCaloriesBurned = (heartRate: number, durationSeconds: number): number => {
    const minutes = durationSeconds / 60
    const weightKg = weight * 0.453592 // convert lbs to kg
  
    const maleCalsPerMin =
      (-55.0969 + 0.6309 * heartRate + 0.1988 * weightKg + 0.2017 * age) / 4.184
  
    const femaleCalsPerMin =
      (-20.4022 + 0.4472 * heartRate - 0.1263 * weightKg + 0.074 * age) / 4.184
  
    const calsPerMin = gender === "male" ? maleCalsPerMin : femaleCalsPerMin
    return Math.max(0, calsPerMin * minutes)
  }
  
  


  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-gold">Performance Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex h-8 items-center rounded-full bg-green-500/20 px-3">
              <span className={`h-2 w-2 rounded-full ${connectionStatus ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="ml-2 text-sm text-white">{connectionStatus ? "Connected" : "Disconnected"}</span>
            </div>
            <Button variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold/10">
              Start Session
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-gold/20 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-gold">Age</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full bg-black border border-gold/50 text-white p-2 rounded-md"
                min={10}
                max={100}
              />
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-gold">Weight (lbs)</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full bg-black border border-gold/50 text-white p-2 rounded-md"
                min={30}
                max={200}
              />
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-gold">Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female")}
                className="w-full bg-black border border-gold/50 text-white p-2 rounded-md"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </CardContent>
          </Card>
        </div>

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
                <div className="text-4xl font-bold text-gold">{punches}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center gap-2">
                 Blocks Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-gold">{blocks}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center gap-2">
                🏃 Motion State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className={`text-2xl font-semibold ${motionState === "active" ? "text-green-400" : "text-gray-400"}`}>
                  {motionState === "active" ? "In Motion" : "Resting"}
                </div>
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
                  {Math.max(data?.fsrIndex || 0, data?.fsrMiddle || 0, data?.fsrImpact || 0)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-gold flex items-center gap-2">
              🔥 Calories Burned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-gold">
                {calculateCaloriesBurned(data?.heartRate || 0, sessionTime).toFixed(1)} kcal
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
                indexForce={data?.fsrIndex || 0}
                middleForce={data?.fsrMiddle || 0}
                impactForce={data?.fsrImpact || 0}
              />
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-black text-white">
            <CardHeader>
                <div>
                    <Button onClick={toggleMockData} variant="secondary" className="w-full">
                    Toggle Mock Data
                    </Button>
                </div>
              <CardTitle className="text-gold">Heart Rate</CardTitle>
              <CardDescription className="text-white/70">
                Current: {data?.heartRate || 0} BPM - Zone: {data?.heartRate || "Resting"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeartRateChart heartRate={data?.heartRate || 0} />
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
              indexForce={data?.fsrIndex || 0}
              middleForce={data?.fsrMiddle || 0}
              impactForce={data?.fsrImpact || 0}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
