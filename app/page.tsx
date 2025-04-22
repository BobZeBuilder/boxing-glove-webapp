"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Activity, Cpu, Zap, BarChart2, Terminal } from "lucide-react"
import { ConnectionStatus } from "@/components/connection-status"
import { SensorReadings } from "@/components/sensor-readings"
import { RawDataViewer } from "@/components/raw-data-viewer"
import { DebugPanel } from "@/components/debug-panel"
import { useSerialData } from "@/hooks/use-serial-data"

export default function SerialMonitorPage() {
  const { toast } = useToast()
  const { data, rawMessages, connectionStatus, error, connect, disconnect, toggleMockData } = useSerialData()

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error,
      })
    }
  }, [error, toast])

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Serial Monitor</h1>
            <p className="text-muted-foreground">Monitor and debug your Arduino boxing glove sensors</p>
          </div>
          <ConnectionStatus status={connectionStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="dashboard">
                  <Activity className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="raw">
                  <Terminal className="mr-2 h-4 w-4" />
                  Raw Data
                </TabsTrigger>
                <TabsTrigger value="debug">
                  <Cpu className="mr-2 h-4 w-4" />
                  Debug
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <SensorReadings data={data} />
              </TabsContent>

              <TabsContent value="raw">
                <RawDataViewer messages={rawMessages} />
              </TabsContent>

              <TabsContent value="debug">
                <DebugPanel data={data} connectionStatus={connectionStatus} rawMessages={rawMessages.slice(-5)} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button onClick={connect} className="w-full" disabled={connectionStatus === "connected"}>
                    Connect
                  </Button>
                  <Button
                    onClick={disconnect}
                    variant="outline"
                    className="w-full"
                    disabled={connectionStatus === "disconnected"}
                  >
                    Disconnect
                  </Button>
                </div>
                <Separator />
                <div>
                  <Button onClick={toggleMockData} variant="secondary" className="w-full">
                    Toggle Mock Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages:</span>
                  <span>{rawMessages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Force:</span>
                  <span>{Math.max(data?.fsrIndex || 0, data?.fsrMiddle || 0, data?.fsrImpact || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
