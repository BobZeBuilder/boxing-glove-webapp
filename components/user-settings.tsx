"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { User, Save, Settings, Bell, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  name: string
  age: string
  weight: string
  height: string
  gender: string
  experience: string
  dominantHand: string
  gloveSize: string
  maxHeartRate: number
}

interface DeviceSettings {
  sensorSensitivity: number
  dataUpdateFrequency: number
  punchDetectionThreshold: number
  enableVibration: boolean
  enableSounds: boolean
  lowBatteryAlert: boolean
}

export function UserSettings() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    experience: "beginner",
    dominantHand: "right",
    gloveSize: "medium",
    maxHeartRate: 220,
  })

  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>({
    sensorSensitivity: 75,
    dataUpdateFrequency: 50,
    punchDetectionThreshold: 60,
    enableVibration: true,
    enableSounds: false,
    lowBatteryAlert: true,
  })

  // Load user profile from localStorage if available
  useEffect(() => {
    const savedProfile = localStorage.getItem("boxingProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile({
        ...parsedProfile,
        maxHeartRate: parsedProfile.age ? 220 - Number.parseInt(parsedProfile.age) : 220,
      })
    }

    const savedSettings = localStorage.getItem("deviceSettings")
    if (savedSettings) {
      setDeviceSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value }

      // Update max heart rate when age changes
      if (field === "age" && value) {
        updated.maxHeartRate = 220 - Number.parseInt(value)
      }

      return updated
    })
  }

  const handleDeviceSettingChange = (field: keyof DeviceSettings, value: any) => {
    setDeviceSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveProfile = () => {
    localStorage.setItem("boxingProfile", JSON.stringify(profile))
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    })
  }

  const saveDeviceSettings = () => {
    localStorage.setItem("deviceSettings", JSON.stringify(deviceSettings))
    toast({
      title: "Settings Saved",
      description: "Your device settings have been updated successfully.",
    })
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-3 bg-boxing-card border border-boxing-border">
        <TabsTrigger value="profile" className="data-[state=active]:bg-gold data-[state=active]:text-black">
          <User className="mr-2 h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="device" className="data-[state=active]:bg-gold data-[state=active]:text-black">
          <Settings className="mr-2 h-4 w-4" />
          Device Settings
        </TabsTrigger>
        <TabsTrigger value="notifications" className="data-[state=active]:bg-gold data-[state=active]:text-black">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4">
        <Card className="bg-boxing-card border-boxing-border">
          <CardHeader className="border-b border-boxing-border">
            <CardTitle className="flex items-center text-gold">
              <User className="mr-2 h-5 w-5 text-gold" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveProfile()
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gold">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className="bg-boxing-background border-boxing-border text-gold focus-visible:ring-gold"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gold">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleProfileChange("age", e.target.value)}
                    className="bg-boxing-background border-boxing-border text-gold focus-visible:ring-gold"
                    placeholder="Your age"
                  />
                  {profile.age && (
                    <p className="text-xs text-gold-light mt-1">Max heart rate: {profile.maxHeartRate} BPM</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-gold">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleProfileChange("weight", e.target.value)}
                    className="bg-boxing-background border-boxing-border text-gold focus-visible:ring-gold"
                    placeholder="Your weight"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-gold">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleProfileChange("height", e.target.value)}
                    className="bg-boxing-background border-boxing-border text-gold focus-visible:ring-gold"
                    placeholder="Your height"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gold">
                    Gender
                  </Label>
                  <Select value={profile.gender} onValueChange={(value) => handleProfileChange("gender", value)}>
                    <SelectTrigger className="bg-boxing-background border-boxing-border text-gold focus:ring-gold">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-boxing-card border-boxing-border">
                      <SelectItem value="male" className="text-gold focus:bg-gold focus:text-black">
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="text-gold focus:bg-gold focus:text-black">
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="text-gold focus:bg-gold focus:text-black">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-gold">
                    Boxing Experience
                  </Label>
                  <Select
                    value={profile.experience}
                    onValueChange={(value) => handleProfileChange("experience", value)}
                  >
                    <SelectTrigger className="bg-boxing-background border-boxing-border text-gold focus:ring-gold">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-boxing-card border-boxing-border">
                      <SelectItem value="beginner" className="text-gold focus:bg-gold focus:text-black">
                        Beginner
                      </SelectItem>
                      <SelectItem value="intermediate" className="text-gold focus:bg-gold focus:text-black">
                        Intermediate
                      </SelectItem>
                      <SelectItem value="advanced" className="text-gold focus:bg-gold focus:text-black">
                        Advanced
                      </SelectItem>
                      <SelectItem value="professional" className="text-gold focus:bg-gold focus:text-black">
                        Professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dominantHand" className="text-gold">
                    Dominant Hand
                  </Label>
                  <Select
                    value={profile.dominantHand}
                    onValueChange={(value) => handleProfileChange("dominantHand", value)}
                  >
                    <SelectTrigger className="bg-boxing-background border-boxing-border text-gold focus:ring-gold">
                      <SelectValue placeholder="Select dominant hand" />
                    </SelectTrigger>
                    <SelectContent className="bg-boxing-card border-boxing-border">
                      <SelectItem value="right" className="text-gold focus:bg-gold focus:text-black">
                        Right
                      </SelectItem>
                      <SelectItem value="left" className="text-gold focus:bg-gold focus:text-black">
                        Left
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gloveSize" className="text-gold">
                    Glove Size
                  </Label>
                  <Select value={profile.gloveSize} onValueChange={(value) => handleProfileChange("gloveSize", value)}>
                    <SelectTrigger className="bg-boxing-background border-boxing-border text-gold focus:ring-gold">
                      <SelectValue placeholder="Select glove size" />
                    </SelectTrigger>
                    <SelectContent className="bg-boxing-card border-boxing-border">
                      <SelectItem value="small" className="text-gold focus:bg-gold focus:text-black">
                        Small (8-10 oz)
                      </SelectItem>
                      <SelectItem value="medium" className="text-gold focus:bg-gold focus:text-black">
                        Medium (12-14 oz)
                      </SelectItem>
                      <SelectItem value="large" className="text-gold focus:bg-gold focus:text-black">
                        Large (16-18 oz)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-black font-medium">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="device" className="mt-4">
        <Card className="bg-boxing-card border-boxing-border">
          <CardHeader className="border-b border-boxing-border">
            <CardTitle className="flex items-center text-gold">
              <Settings className="mr-2 h-5 w-5 text-gold" />
              Device Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveDeviceSettings()
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sensorSensitivity" className="text-gold">
                      Sensor Sensitivity
                    </Label>
                    <span className="text-gold">{deviceSettings.sensorSensitivity}%</span>
                  </div>
                  <Slider
                    id="sensorSensitivity"
                    min={0}
                    max={100}
                    step={1}
                    value={[deviceSettings.sensorSensitivity]}
                    onValueChange={(value) => handleDeviceSettingChange("sensorSensitivity", value[0])}
                    className="[&>span]:bg-gold"
                  />
                  <p className="text-xs text-gold-light">Adjust how sensitive the force sensors are to pressure.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="dataUpdateFrequency" className="text-gold">
                      Data Update Frequency
                    </Label>
                    <span className="text-gold">{deviceSettings.dataUpdateFrequency} Hz</span>
                  </div>
                  <Slider
                    id="dataUpdateFrequency"
                    min={10}
                    max={100}
                    step={5}
                    value={[deviceSettings.dataUpdateFrequency]}
                    onValueChange={(value) => handleDeviceSettingChange("dataUpdateFrequency", value[0])}
                    className="[&>span]:bg-gold"
                  />
                  <p className="text-xs text-gold-light">
                    Set how frequently the device sends data updates (higher values use more battery).
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="punchDetectionThreshold" className="text-gold">
                      Punch Detection Threshold
                    </Label>
                    <span className="text-gold">{deviceSettings.punchDetectionThreshold}%</span>
                  </div>
                  <Slider
                    id="punchDetectionThreshold"
                    min={20}
                    max={100}
                    step={5}
                    value={[deviceSettings.punchDetectionThreshold]}
                    onValueChange={(value) => handleDeviceSettingChange("punchDetectionThreshold", value[0])}
                    className="[&>span]:bg-gold"
                  />
                  <p className="text-xs text-gold-light">Adjust how much force is required to register a punch.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableVibration" className="text-gold">
                        Enable Vibration
                      </Label>
                      <p className="text-xs text-gold-light">Vibrate on punch detection and alerts.</p>
                    </div>
                    <Switch
                      id="enableVibration"
                      checked={deviceSettings.enableVibration}
                      onCheckedChange={(value) => handleDeviceSettingChange("enableVibration", value)}
                      className="data-[state=checked]:bg-gold"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableSounds" className="text-gold">
                        Enable Sounds
                      </Label>
                      <p className="text-xs text-gold-light">Play sounds for punch detection and alerts.</p>
                    </div>
                    <Switch
                      id="enableSounds"
                      checked={deviceSettings.enableSounds}
                      onCheckedChange={(value) => handleDeviceSettingChange("enableSounds", value)}
                      className="data-[state=checked]:bg-gold"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lowBatteryAlert" className="text-gold">
                        Low Battery Alert
                      </Label>
                      <p className="text-xs text-gold-light">Receive alerts when battery is low.</p>
                    </div>
                    <Switch
                      id="lowBatteryAlert"
                      checked={deviceSettings.lowBatteryAlert}
                      onCheckedChange={(value) => handleDeviceSettingChange("lowBatteryAlert", value)}
                      className="data-[state=checked]:bg-gold"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-black font-medium">
                <Save className="mr-2 h-4 w-4" />
                Save Device Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-4">
        <Card className="bg-boxing-card border-boxing-border">
          <CardHeader className="border-b border-boxing-border">
            <CardTitle className="flex items-center text-gold">
              <Bell className="mr-2 h-5 w-5 text-gold" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gold">Heart Rate Alerts</Label>
                    <p className="text-xs text-gold-light">Notify when heart rate exceeds your target zone.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-gold" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gold">Workout Milestones</Label>
                    <p className="text-xs text-gold-light">Notify when you reach punch count milestones.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-gold" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gold">Inactivity Reminders</Label>
                    <p className="text-xs text-gold-light">
                      Remind you to continue your workout after periods of inactivity.
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-gold" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gold">Performance Insights</Label>
                    <p className="text-xs text-gold-light">Receive notifications about your boxing performance.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-gold" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gold">Training Reminders</Label>
                    <p className="text-xs text-gold-light">Scheduled reminders for your training sessions.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-gold" />
                </div>
              </div>

              <div className="p-4 bg-boxing-background rounded-md border border-boxing-border">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-gold mr-2" />
                  <h3 className="text-gold font-medium">Privacy Settings</h3>
                </div>
                <p className="text-sm text-gold-light mb-4">Control how your boxing data is stored and shared.</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gold text-sm">Store workout history locally</Label>
                    <Switch className="data-[state=checked]:bg-gold" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-gold text-sm">Share anonymous usage data</Label>
                    <Switch className="data-[state=checked]:bg-gold" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-gold text-sm">Cloud backup of settings</Label>
                    <Switch className="data-[state=checked]:bg-gold" defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gold hover:bg-gold-dark text-black font-medium">
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
