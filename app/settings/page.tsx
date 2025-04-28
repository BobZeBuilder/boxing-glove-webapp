import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-gold">Settings</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <Tabs defaultValue="device" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-gold/20">
              <TabsTrigger value="device" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Device
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="device" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold">Device Settings</CardTitle>
                  <CardDescription className="text-white/70">
                    Configure your boxing glove sensors and connection settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="device-name" className="text-white">
                      Device Name
                    </Label>
                    <Input
                      id="device-name"
                      defaultValue="BoxSense Glove #1"
                      className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gold">Sensor Calibration</h3>

                    <div className="space-y-2">
                      <Label htmlFor="index-sensitivity" className="text-white">
                        Index Finger Sensitivity
                      </Label>
                      <div className="grid grid-cols-[1fr_80px] gap-4 items-center">
                        <Input
                          id="index-sensitivity"
                          type="range"
                          min="1"
                          max="10"
                          defaultValue="7"
                          className="accent-gold"
                        />
                        <div className="text-center border border-gold/20 rounded py-1 text-white">7</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="middle-sensitivity" className="text-white">
                        Middle Finger Sensitivity
                      </Label>
                      <div className="grid grid-cols-[1fr_80px] gap-4 items-center">
                        <Input
                          id="middle-sensitivity"
                          type="range"
                          min="1"
                          max="10"
                          defaultValue="6"
                          className="accent-gold"
                        />
                        <div className="text-center border border-gold/20 rounded py-1 text-white">6</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="impact-sensitivity" className="text-white">
                        Impact Sensor Sensitivity
                      </Label>
                      <div className="grid grid-cols-[1fr_80px] gap-4 items-center">
                        <Input
                          id="impact-sensitivity"
                          type="range"
                          min="1"
                          max="10"
                          defaultValue="8"
                          className="accent-gold"
                        />
                        <div className="text-center border border-gold/20 rounded py-1 text-white">8</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gold">Connection Settings</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Auto-Connect</Label>
                        <p className="text-sm text-white/70">Automatically connect to the last used device</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Background Data Collection</Label>
                        <p className="text-sm text-white/70">Continue collecting data when app is in background</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-gold text-black hover:bg-gold/90">Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold">Account Settings</CardTitle>
                  <CardDescription className="text-white/70">
                    Manage your account information and preferences
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

                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-white">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      defaultValue="75"
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
                      defaultValue="180"
                      className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      defaultValue="22"
                      className="border-gold/20 bg-black text-white focus-visible:ring-gold"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-gold text-black hover:bg-gold/90">Update Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold">Notification Settings</CardTitle>
                  <CardDescription className="text-white/70">
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Training Reminders</Label>
                        <p className="text-sm text-white/70">Receive reminders for scheduled training sessions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Performance Milestones</Label>
                        <p className="text-sm text-white/70">Get notified when you reach new performance milestones</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Weekly Reports</Label>
                        <p className="text-sm text-white/70">Receive weekly performance summary reports</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">System Updates</Label>
                        <p className="text-sm text-white/70">Get notified about app and firmware updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-gold text-black hover:bg-gold/90">Save Preferences</Button>
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
