import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-gold">Punch Analytics</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-gold/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Overview
              </TabsTrigger>
              <TabsTrigger value="force" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Force Analysis
              </TabsTrigger>
              <TabsTrigger value="technique" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Technique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-gold/20 bg-black text-white">
                  <CardHeader>
                    <CardTitle className="text-gold flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Punch Distribution
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Breakdown of punch types over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full w-full items-center justify-center rounded border border-gold/20 bg-black/50 text-white/50">
                        <div className="text-center">
                          <PieChart className="mx-auto h-10 w-10 text-gold/40" />
                          <p className="mt-2">Punch distribution chart will render here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gold/20 bg-black text-white">
                  <CardHeader>
                    <CardTitle className="text-gold flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Progress Over Time
                    </CardTitle>
                    <CardDescription className="text-white/70">Your punch force and speed improvements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full w-full items-center justify-center rounded border border-gold/20 bg-black/50 text-white/50">
                        <div className="text-center">
                          <LineChart className="mx-auto h-10 w-10 text-gold/40" />
                          <p className="mt-2">Progress chart will render here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="force" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Force Analysis
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Detailed breakdown of your punch force metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <div className="flex h-full w-full items-center justify-center rounded border border-gold/20 bg-black/50 text-white/50">
                      <div className="text-center">
                        <BarChart className="mx-auto h-10 w-10 text-gold/40" />
                        <p className="mt-2">Force analysis chart will render here</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technique" className="mt-6">
              <Card className="border-gold/20 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-gold">Technique Analysis</CardTitle>
                  <CardDescription className="text-white/70">
                    Insights into your boxing technique and form
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gold">Punch Accuracy</h3>
                        <div className="h-4 w-full rounded-full bg-white/10">
                          <div className="h-4 rounded-full bg-gold" style={{ width: "75%" }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Score</span>
                          <span className="font-medium text-white">75%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gold">Form Consistency</h3>
                        <div className="h-4 w-full rounded-full bg-white/10">
                          <div className="h-4 rounded-full bg-gold" style={{ width: "82%" }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Score</span>
                          <span className="font-medium text-white">82%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gold">Technique Insights</h3>
                      <div className="space-y-2">
                        <div className="rounded-md border border-gold/20 p-4">
                          <h4 className="font-medium text-white">Jab Technique</h4>
                          <p className="mt-1 text-sm text-white/70">
                            Your jab shows good extension but could benefit from faster retraction. Focus on snapping
                            your jab back to guard position.
                          </p>
                        </div>
                        <div className="rounded-md border border-gold/20 p-4">
                          <h4 className="font-medium text-white">Cross Technique</h4>
                          <p className="mt-1 text-sm text-white/70">
                            Your cross shows excellent power. Work on rotating your hips more to generate additional
                            force.
                          </p>
                        </div>
                        <div className="rounded-md border border-gold/20 p-4">
                          <h4 className="font-medium text-white">Hook Technique</h4>
                          <p className="mt-1 text-sm text-white/70">
                            Your hook technique is inconsistent. Focus on maintaining proper form throughout the punch.
                          </p>
                        </div>
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
