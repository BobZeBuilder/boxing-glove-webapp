"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SerialData } from "@/hooks/use-serial-data"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface PunchData {
  timestamp: number
  force: number
  speed: number
  type: string
}

interface PunchAnalysisProps {
  data: SerialData | null
}

export function PunchAnalysis({ data }: PunchAnalysisProps) {
  const [punchHistory, setPunchHistory] = useState<PunchData[]>([])
  const [lastPunchForce, setLastPunchForce] = useState(0)
  const [maxForce, setMaxForce] = useState(0)
  const [avgForce, setAvgForce] = useState(0)
  const [punchTypes, setPunchTypes] = useState({
    jab: 0,
    cross: 0,
    hook: 0,
    uppercut: 0,
  })

  // Track punches based on accelerometer spikes
  useEffect(() => {
    if (!data) return

    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(
      Math.pow(data.accelerometer.x, 2) + Math.pow(data.accelerometer.y, 2) + Math.pow(data.accelerometer.z, 2),
    )

    // Detect punch based on acceleration spike
    if (magnitude > 5) {
      // Calculate force from FSR sensors
      const force = Math.max(data.fsrIndex, data.fsrMiddle, data.fsrImpact)

      // Determine punch type based on sensor readings and accelerometer data
      let punchType = "jab"

      if (data.fsrIndex > data.fsrMiddle && data.fsrIndex > data.fsrImpact) {
        if (Math.abs(data.accelerometer.x) > Math.abs(data.accelerometer.y)) {
          punchType = "jab"
        } else {
          punchType = "hook"
        }
      } else if (data.fsrMiddle > data.fsrIndex && data.fsrMiddle > data.fsrImpact) {
        punchType = "cross"
      } else if (data.accelerometer.y < -5) {
        punchType = "uppercut"
      } else if (force > 800) {
        punchType = "cross"
      }

      // Update punch type counts
      setPunchTypes((prev) => ({
        ...prev,
        [punchType]: prev[punchType as keyof typeof prev] + 1,
      }))

      // Add to punch history
      const newPunch: PunchData = {
        timestamp: Date.now(),
        force,
        speed: magnitude,
        type: punchType,
      }

      setPunchHistory((prev) => {
        // Keep only the last 50 punches
        const updated = [...prev, newPunch].slice(-50)

        // Update stats
        setLastPunchForce(force)
        setMaxForce(Math.max(...updated.map((p) => p.force)))
        setAvgForce(updated.reduce((sum, p) => sum + p.force, 0) / updated.length)

        return updated
      })
    }
  }, [data])

  if (!data) {
    return (
      <Card className="bg-boxing-card border-boxing-border">
        <CardHeader className="border-b border-boxing-border">
          <CardTitle className="text-gold">No Data Available</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gold-light">
            Connect to your boxing glove device or enable demo mode to see punch analysis
          </p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for charts
  const forceOverTime = punchHistory.map((punch, index) => ({
    name: index,
    force: punch.force,
    type: punch.type,
    time: new Date(punch.timestamp).toLocaleTimeString(),
  }))

  const speedOverTime = punchHistory.map((punch, index) => ({
    name: index,
    speed: Math.round(punch.speed * 10),
    type: punch.type,
    time: new Date(punch.timestamp).toLocaleTimeString(),
  }))

  const punchTypeData = [
    { name: "Jab", value: punchTypes.jab, color: "#3b82f6" },
    { name: "Cross", value: punchTypes.cross, color: "#ef4444" },
    { name: "Hook", value: punchTypes.hook, color: "#f97316" },
    { name: "Uppercut", value: punchTypes.uppercut, color: "#8b5cf6" },
  ]

  // Force distribution data
  const forceDistribution = [
    { name: "Light (<300)", value: punchHistory.filter((p) => p.force < 300).length, color: "#22c55e" },
    {
      name: "Medium (300-600)",
      value: punchHistory.filter((p) => p.force >= 300 && p.force < 600).length,
      color: "#eab308",
    },
    { name: "Heavy (600+)", value: punchHistory.filter((p) => p.force >= 600).length, color: "#ef4444" },
  ]

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-boxing-background p-2 border border-gold rounded-md">
          <p className="text-gold font-medium">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-gold-light text-xs">{`Type: ${payload[0].payload.type}`}</p>
          <p className="text-gold-light text-xs">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 bg-boxing-card border border-boxing-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Overview
          </TabsTrigger>
          <TabsTrigger value="force" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Force Analysis
          </TabsTrigger>
          <TabsTrigger value="speed" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Speed Analysis
          </TabsTrigger>
          <TabsTrigger value="types" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Punch Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-boxing-card border-boxing-border">
              <CardHeader className="border-b border-boxing-border pb-2">
                <CardTitle className="text-gold">Punch Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={punchTypeData.filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {punchTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend formatter={(value) => <span style={{ color: "#ffd700" }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-boxing-card border-boxing-border">
              <CardHeader className="border-b border-boxing-border pb-2">
                <CardTitle className="text-gold">Force Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={forceDistribution.filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {forceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend formatter={(value) => <span style={{ color: "#ffd700" }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-boxing-card border-boxing-border mt-6">
            <CardHeader className="border-b border-boxing-border pb-2">
              <CardTitle className="text-gold">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-boxing-background rounded-md border border-boxing-border">
                  <h3 className="text-gold font-medium mb-2">Power Analysis</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gold-light">Max Force:</span>
                    <span className="text-gold font-medium">{maxForce} N</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gold-light">Avg Force:</span>
                    <span className="text-gold font-medium">{Math.round(avgForce)} N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-light">Last Punch:</span>
                    <span className="text-gold font-medium">{lastPunchForce} N</span>
                  </div>
                </div>

                <div className="p-4 bg-boxing-background rounded-md border border-boxing-border">
                  <h3 className="text-gold font-medium mb-2">Punch Count</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gold-light">Jabs:</span>
                    <span className="text-gold font-medium">{punchTypes.jab}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gold-light">Crosses:</span>
                    <span className="text-gold font-medium">{punchTypes.cross}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gold-light">Hooks:</span>
                    <span className="text-gold font-medium">{punchTypes.hook}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-light">Uppercuts:</span>
                    <span className="text-gold font-medium">{punchTypes.uppercut}</span>
                  </div>
                </div>

                <div className="p-4 bg-boxing-background rounded-md border border-boxing-border">
                  <h3 className="text-gold font-medium mb-2">Technique Tips</h3>
                  <p className="text-gold-light text-sm">
                    {punchTypes.jab > punchTypes.cross &&
                    punchTypes.jab > punchTypes.hook &&
                    punchTypes.jab > punchTypes.uppercut
                      ? "Good use of jabs. Try adding more power punches to combinations."
                      : punchTypes.cross > punchTypes.jab &&
                          punchTypes.cross > punchTypes.hook &&
                          punchTypes.cross > punchTypes.uppercut
                        ? "Strong crosses. Mix in more jabs to set up your power punches."
                        : punchTypes.hook > punchTypes.jab &&
                            punchTypes.hook > punchTypes.cross &&
                            punchTypes.hook > punchTypes.uppercut
                          ? "Hooks looking good. Remember to protect your chin when throwing hooks."
                          : punchTypes.uppercut > 0
                            ? "Nice uppercuts. Keep your guard high when throwing them."
                            : "Focus on mixing up your punches for better combinations."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="force" className="mt-4">
          <Card className="bg-boxing-card border-boxing-border">
            <CardHeader className="border-b border-boxing-border pb-2">
              <CardTitle className="text-gold">Force Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forceOverTime} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: "#ffd700", fontSize: 10 }} stroke="#333" />
                    <YAxis tick={{ fill: "#ffd700", fontSize: 10 }} stroke="#333" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => <span style={{ color: "#ffd700" }}>{value}</span>} />
                    <Line
                      type="monotone"
                      dataKey="force"
                      stroke="#ffd700"
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props
                        let color = "#3b82f6"

                        switch (payload.type) {
                          case "jab":
                            color = "#3b82f6"
                            break
                          case "cross":
                            color = "#ef4444"
                            break
                          case "hook":
                            color = "#f97316"
                            break
                          case "uppercut":
                            color = "#8b5cf6"
                            break
                        }

                        return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#ffd700" strokeWidth={1} />
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 bg-boxing-background rounded-md border border-boxing-border">
                <h3 className="text-gold font-medium mb-2">Force Analysis</h3>
                <p className="text-gold-light text-sm">
                  {maxForce > 800
                    ? "Excellent power generation! Your punches show significant force. Focus on maintaining this power while improving speed."
                    : maxForce > 500
                      ? "Good power in your punches. To increase force, focus on hip rotation and proper weight transfer."
                      : "Work on power development. Try engaging your core and legs more when punching. Practice on a heavy bag to build strength."}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light">Light Punches</div>
                    <div className="text-lg font-medium text-gold">
                      {punchHistory.filter((p) => p.force < 300).length}
                    </div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light">Medium Punches</div>
                    <div className="text-lg font-medium text-gold">
                      {punchHistory.filter((p) => p.force >= 300 && p.force < 600).length}
                    </div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light">Heavy Punches</div>
                    <div className="text-lg font-medium text-gold">
                      {punchHistory.filter((p) => p.force >= 600).length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speed" className="mt-4">
          <Card className="bg-boxing-card border-boxing-border">
            <CardHeader className="border-b border-boxing-border pb-2">
              <CardTitle className="text-gold">Speed Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={speedOverTime} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: "#ffd700", fontSize: 10 }} stroke="#333" />
                    <YAxis tick={{ fill: "#ffd700", fontSize: 10 }} stroke="#333" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => <span style={{ color: "#ffd700" }}>{value}</span>} />
                    <Line
                      type="monotone"
                      dataKey="speed"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props
                        let color = "#3b82f6"

                        switch (payload.type) {
                          case "jab":
                            color = "#3b82f6"
                            break
                          case "cross":
                            color = "#ef4444"
                            break
                          case "hook":
                            color = "#f97316"
                            break
                          case "uppercut":
                            color = "#8b5cf6"
                            break
                        }

                        return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#22d3ee" strokeWidth={1} />
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 bg-boxing-background rounded-md border border-boxing-border">
                <h3 className="text-gold font-medium mb-2">Speed Analysis</h3>
                <p className="text-gold-light text-sm">
                  {punchHistory.length > 0 &&
                  punchHistory.reduce((sum, p) => sum + p.speed, 0) / punchHistory.length > 10
                    ? "Excellent hand speed! Your fast punches will catch opponents off guard. Focus on maintaining accuracy with this speed."
                    : punchHistory.length > 0 &&
                        punchHistory.reduce((sum, p) => sum + p.speed, 0) / punchHistory.length > 7
                      ? "Good punch speed. Work on relaxing between combinations to maintain energy and increase speed."
                      : "Focus on improving hand speed. Practice speed drills, shadowboxing, and double-end bag work to develop faster hands."}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light">Slow Punches</div>
                    <div className="text-lg font-medium text-gold">
                      {punchHistory.filter((p) => p.speed < 7).length}
                    </div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light">Medium Speed</div>
                    <div className="text-lg font-medium text-gold">
                      {punchHistory.filter((p) => p.speed >= 7 && p.speed < 12).length}
                    </div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light">Fast Punches</div>
                    <div className="text-lg font-medium text-gold">
                      {punchHistory.filter((p) => p.speed >= 12).length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-boxing-card border-boxing-border">
              <CardHeader className="border-b border-boxing-border pb-2">
                <CardTitle className="text-gold">Punch Type Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={punchTypeData.filter((item) => item.value > 0)}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: "#ffd700", fontSize: 10 }} stroke="#333" />
                      <YAxis tick={{ fill: "#ffd700", fontSize: 10 }} stroke="#333" />
                      <Tooltip />
                      <Legend formatter={(value) => <span style={{ color: "#ffd700" }}>{value}</span>} />
                      <Bar dataKey="value" fill="#ffd700">
                        {punchTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-boxing-card border-boxing-border">
              <CardHeader className="border-b border-boxing-border pb-2">
                <CardTitle className="text-gold">Punch Type Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="p-3 bg-boxing-background rounded-md border border-boxing-border">
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <div className="text-sm text-gold font-medium">Jab</div>
                    </div>
                    <p className="text-xs text-gold-light">
                      Quick, straight punch with the lead hand. Used to measure distance, set up combinations, and keep
                      opponents at bay.
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-gold-light">Count:</span>
                      <span className="text-xs text-gold">{punchTypes.jab}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-boxing-background rounded-md border border-boxing-border">
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="text-sm text-gold font-medium">Cross</div>
                    </div>
                    <p className="text-xs text-gold-light">
                      Powerful straight punch with the rear hand. Follows the jab in the basic "one-two" combination.
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-gold-light">Count:</span>
                      <span className="text-xs text-gold">{punchTypes.cross}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-boxing-background rounded-md border border-boxing-border">
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <div className="text-sm text-gold font-medium">Hook</div>
                    </div>
                    <p className="text-xs text-gold-light">
                      Circular punch that comes from the side. Can be thrown with either hand and targets the jaw or
                      body.
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-gold-light">Count:</span>
                      <span className="text-xs text-gold">{punchTypes.hook}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-boxing-background rounded-md border border-boxing-border">
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <div className="text-sm text-gold font-medium">Uppercut</div>
                    </div>
                    <p className="text-xs text-gold-light">
                      Upward vertical punch that targets the chin or body. Effective in close range fighting.
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-gold-light">Count:</span>
                      <span className="text-xs text-gold">{punchTypes.uppercut}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-boxing-card border-boxing-border mt-6">
            <CardHeader className="border-b border-boxing-border pb-2">
              <CardTitle className="text-gold">Combination Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-4 bg-boxing-background rounded-md border border-boxing-border">
                <h3 className="text-gold font-medium mb-2">Punch Balance</h3>
                <p className="text-gold-light text-sm mb-4">
                  {punchTypes.jab > (punchTypes.cross + punchTypes.hook + punchTypes.uppercut) * 0.8
                    ? "Your technique shows a heavy reliance on jabs. While jabs are essential, try incorporating more power punches into your combinations."
                    : punchTypes.cross > (punchTypes.jab + punchTypes.hook + punchTypes.uppercut) * 0.6
                      ? "You're relying heavily on crosses. Remember to set up your power punches with jabs and mix in hooks for variety."
                      : punchTypes.hook > (punchTypes.jab + punchTypes.cross + punchTypes.uppercut) * 0.5
                        ? "You're throwing a lot of hooks. Make sure to protect your chin when throwing hooks and set them up with straight punches."
                        : punchTypes.uppercut > (punchTypes.jab + punchTypes.cross + punchTypes.hook) * 0.3
                          ? "You're using uppercuts frequently. Remember uppercuts leave you more exposed, so use them selectively in combinations."
                          : "You have a good balance of punch types. Continue working on combinations that mix different punches for maximum effectiveness."}
                </p>

                <h3 className="text-gold font-medium mb-2">Recommended Combinations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light mb-1">Basic Combination</div>
                    <div className="text-sm text-gold">Jab - Cross - Hook</div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light mb-1">Advanced Combination</div>
                    <div className="text-sm text-gold">Jab - Cross - Hook - Uppercut</div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light mb-1">Counter Combination</div>
                    <div className="text-sm text-gold">Slip - Cross - Hook - Cross</div>
                  </div>
                  <div className="p-2 bg-boxing-card rounded-md">
                    <div className="text-xs text-gold-light mb-1">Body-Head Combination</div>
                    <div className="text-sm text-gold">Jab - Body Hook - Cross</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
