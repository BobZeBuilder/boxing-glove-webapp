"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Activity } from "lucide-react"

export default function ProfileSettingsPage() {
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(175)
  const [restingHeartRate, setRestingHeartRate] = useState(65)
  const [maxHeartRate, setMaxHeartRate] = useState(190)

  // Calculate heart rate zones based on user profile
  const calculateHeartRateZones = () => {
    // Using the Karvonen formula: Target HR = ((HRmax − HRrest) × % Intensity) + HRrest
    const reserve = maxHeartRate - restingHeartRate

    return {
      resting: { min: 0, max: restingHeartRate },
      warmUp: { min: restingHeartRate, max: Math.round(restingHeartRate + reserve * 0.5) },
      fatBurn: { min: Math.round(restingHeartRate + reserve * 0.5), max: Math.round(restingHeartRate + reserve * 0.7) },
      cardio: { min: Math.round(restingHeartRate + reserve * 0.7), max: Math.round(restingHeartRate + reserve * 0.85) },
      peak: { min: Math.round(restingHeartRate + reserve * 0.85), max: maxHeartRate },
    }
  }

  const heartRateZones = calculateHeartRateZones()

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-gold">Profile Settings</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-gold/20">
              <TabsTrigger value="profile" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Profile
              </TabsTrigger>
              <TabsTrigger value="heart-rate" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Heart Rate
              </TabsTrigger>
              <TabsTrigger value="training" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Training
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Update your personal details and physical measurements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="full-name"
                        defaultValue="John Doe"
                        className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-white">
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number.parseInt(e.target.value))}
                        className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-white">
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number.parseInt(e.target.value))}
                        className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-white">
                        Height (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number.parseInt(e.target.value))}
                        className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-white">
                      Boxing Experience
                    </Label>
                    <Select defaultValue="intermediate">
                      <SelectTrigger className="border-gold/20 bg-black text-white focus:ring-gold">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent className="border-gold/20 bg-black text-white">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-gold text-black hover:bg-gold/90">Save Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="heart-rate" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Heart Rate Settings
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Configure your heart rate zones for accurate training feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="resting-hr" className="text-white">
                        Resting Heart Rate (BPM)
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="resting-hr"
                          min={40}
                          max={100}
                          step={1}
                          value={[restingHeartRate]}
                          onValueChange={(value) => setRestingHeartRate(value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center text-white font-medium">{restingHeartRate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-hr" className="text-white">
                        Maximum Heart Rate (BPM)
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="max-hr"
                          min={160}
                          max={220}
                          step={1}
                          value={[maxHeartRate]}
                          onValueChange={(value) => setMaxHeartRate(value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center text-white font-medium">{maxHeartRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium text-gold">Heart Rate Zones</h3>
                    <p className="text-sm text-white/70">
                      Your heart rate zones are calculated based on your resting and maximum heart rates. These zones
                      help you train at the right intensity for your goals.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-3 gap-2 text-sm text-white/70">
                        <div>Zone</div>
                        <div>Range (BPM)</div>
                        <div>Training Effect</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 items-center border-t border-gold/10 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-white">Resting</span>
                        </div>
                        <div className="text-white">
                          {heartRateZones.resting.min} - {heartRateZones.resting.max}
                        </div>
                        <div className="text-white/70 text-sm">Recovery</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 items-center border-t border-gold/10 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
                          <span className="text-white">Warm Up</span>
                        </div>
                        <div className="text-white">
                          {heartRateZones.warmUp.min} - {heartRateZones.warmUp.max}
                        </div>
                        <div className="text-white/70 text-sm">Builds endurance</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 items-center border-t border-gold/10 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-white">Fat Burn</span>
                        </div>
                        <div className="text-white">
                          {heartRateZones.fatBurn.min} - {heartRateZones.fatBurn.max}
                        </div>
                        <div className="text-white/70 text-sm">Improves aerobic fitness</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 items-center border-t border-gold/10 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                          <span className="text-white">Cardio</span>
                        </div>
                        <div className="text-white">
                          {heartRateZones.cardio.min} - {heartRateZones.cardio.max}
                        </div>
                        <div className="text-white/70 text-sm">Increases performance</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 items-center border-t border-gold/10 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-white">Peak</span>
                        </div>
                        <div className="text-white">
                          {heartRateZones.peak.min} - {heartRateZones.peak.max}
                        </div>
                        <div className="text-white/70 text-sm">Maximum effort</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-gold text-black hover:bg-gold/90">Save Heart Rate Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Training Preferences
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Configure your training goals and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="training-goal" className="text-white">
                      Primary Training Goal
                    </Label>
                    <Select defaultValue="technique">
                      <SelectTrigger className="border-gold/20 bg-black text-white focus:ring-gold">
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                      <SelectContent className="border-gold/20 bg-black text-white">
                        <SelectItem value="technique">Improve Technique</SelectItem>
                        <SelectItem value="power">Increase Power</SelectItem>
                        <SelectItem value="speed">Increase Speed</SelectItem>
                        <SelectItem value="endurance">Build Endurance</SelectItem>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gold">Sensor Sensitivity</h3>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="index-sensitivity" className="text-white">
                            Index Finger Sensitivity
                          </Label>
                          <span className="text-white/70 text-sm">7</span>
                        </div>
                        <Slider
                          id="index-sensitivity"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[7]}
                          className="flex-1"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="middle-sensitivity" className="text-white">
                            Middle Finger Sensitivity
                          </Label>
                          <span className="text-white/70 text-sm">6</span>
                        </div>
                        <Slider
                          id="middle-sensitivity"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[6]}
                          className="flex-1"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="impact-sensitivity" className="text-white">
                            Impact Sensor Sensitivity
                          </Label>
                          <span className="text-white/70 text-sm">8</span>
                        </div>
                        <Slider
                          id="impact-sensitivity"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[8]}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gold">Training Notifications</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Heart Rate Alerts</Label>
                          <p className="text-sm text-white/70">Notify when heart rate exceeds target zones</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Force Feedback</Label>
                          <p className="text-sm text-white/70">Provide feedback on punch force and technique</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Session Summaries</Label>
                          <p className="text-sm text-white/70">
                            Receive detailed summaries after each training session
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-gold text-black hover:bg-gold/90">Save Training Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
