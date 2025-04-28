import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Activity, Dumbbell } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-gold">Training History</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-gold/20">
              <TabsTrigger value="sessions" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Sessions
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Statistics
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="mt-6">
              <div className="grid gap-6">
                {[1, 2, 3, 4, 5].map((session) => (
                  <Card key={session} className="border-gold/20 bg-black text-white overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-gold/20 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gold" />
                          <span className="text-sm text-white/70">April {session + 9}, 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gold" />
                          <span className="text-sm text-white/70">32:14 minutes</span>
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-gold">Training Session #{session}</h3>
                      </div>

                      <div className="p-6 md:w-3/4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-white/70">Total Punches</div>
                            <div className="text-2xl font-bold text-gold">{120 + session * 10}</div>
                          </div>
                          <div>
                            <div className="text-sm text-white/70">Avg. Force</div>
                            <div className="text-2xl font-bold text-gold">{75 + session}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-white/70">Max Heart Rate</div>
                            <div className="text-2xl font-bold text-gold">{140 + session} BPM</div>
                          </div>
                          <div>
                            <div className="text-sm text-white/70">Calories</div>
                            <div className="text-2xl font-bold text-gold">{250 + session * 20}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button className="text-sm text-gold hover:underline">View Details</button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-gold/20 bg-black text-white">
                  <CardHeader>
                    <CardTitle className="text-gold">Punch Statistics</CardTitle>
                    <CardDescription className="text-white/70">Your punch performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full w-full items-center justify-center rounded border border-gold/20 bg-black/50 text-white/50">
                        <div className="text-center">
                          <Activity className="mx-auto h-10 w-10 text-gold/40" />
                          <p className="mt-2">Punch statistics chart will render here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gold/20 bg-black text-white">
                  <CardHeader>
                    <CardTitle className="text-gold">Heart Rate Zones</CardTitle>
                    <CardDescription className="text-white/70">Time spent in each heart rate zone</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full w-full items-center justify-center rounded border border-gold/20 bg-black/50 text-white/50">
                        <div className="text-center">
                          <Activity className="mx-auto h-10 w-10 text-gold/40" />
                          <p className="mt-2">Heart rate zone chart will render here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold">Training Progress</CardTitle>
                  <CardDescription className="text-white/70">Your improvement over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-5 w-5 text-gold" />
                          <span className="font-medium text-white">Punch Force</span>
                        </div>
                        <span className="text-sm text-gold">+15%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gold" style={{ width: "75%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-gold" />
                          <span className="font-medium text-white">Punch Speed</span>
                        </div>
                        <span className="text-sm text-gold">+8%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gold" style={{ width: "68%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-gold" />
                          <span className="font-medium text-white">Endurance</span>
                        </div>
                        <span className="text-sm text-gold">+23%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gold" style={{ width: "83%" }}></div>
                      </div>
                    </div>
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
