import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SerialData, ConnectionStatusType } from "@/hooks/use-serial-data"
import { Terminal, Bug, Info, Database } from "lucide-react"

interface RawMessage {
  type: "data" | "status" | "error"
  content: any
  timestamp: string
}

interface SerialMonitorProps {
  data: SerialData | null
  rawMessages: RawMessage[]
  connectionStatus: ConnectionStatusType
}

export function SerialMonitor({ data, rawMessages, connectionStatus }: SerialMonitorProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-boxing-card border-boxing-border">
        <CardHeader className="border-b border-boxing-border">
          <CardTitle className="flex items-center text-gold">
            <Terminal className="mr-2 h-5 w-5 text-gold" />
            Serial Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="raw">
            <TabsList className="grid w-full grid-cols-3 bg-boxing-muted">
              <TabsTrigger value="raw" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Raw Data
              </TabsTrigger>
              <TabsTrigger value="parsed" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Parsed JSON
              </TabsTrigger>
              <TabsTrigger value="debug" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Debug Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="raw" className="mt-4">
              <ScrollArea className="h-[500px] rounded-md border border-boxing-border p-4 bg-boxing-background">
                {rawMessages.length > 0 ? (
                  rawMessages.map((message, index) => (
                    <div key={index} className="mb-4 pb-4 border-b border-boxing-border last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            message.type === "error" ? "destructive" : message.type === "status" ? "outline" : "default"
                          }
                          className={
                            message.type === "error"
                              ? "bg-red-600 text-white"
                              : message.type === "status"
                                ? "border-gold text-gold"
                                : "bg-gold text-black"
                          }
                        >
                          {message.type}
                        </Badge>
                        <span className="text-xs text-gold-light">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="text-xs overflow-auto p-2 bg-boxing-muted rounded-md text-gold">
                        {typeof message.content === "object"
                          ? JSON.stringify(message.content, null, 2)
                          : String(message.content)}
                      </pre>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gold-light">
                    No messages received yet
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="parsed" className="mt-4">
              <div className="rounded-md bg-boxing-background p-4 border border-boxing-border mb-4">
                <h3 className="mb-2 font-medium text-gold flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Current Data State
                </h3>
                <pre className="text-xs overflow-auto p-2 bg-boxing-muted rounded-md text-gold">
                  {JSON.stringify(data, null, 2) || "No data available"}
                </pre>
              </div>

              <Alert className="bg-boxing-muted border-gold">
                <Info className="h-4 w-4 text-gold" />
                <AlertDescription className="text-gold">
                  This tab shows the parsed JSON data from your boxing glove device.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="debug" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-md bg-boxing-background border border-boxing-border">
                  <span className="text-gold">Connection Status:</span>
                  <Badge
                    variant={
                      connectionStatus === "connected"
                        ? "default"
                        : connectionStatus === "error"
                          ? "destructive"
                          : "outline"
                    }
                    className={
                      connectionStatus === "connected"
                        ? "bg-green-600 text-white"
                        : connectionStatus === "error"
                          ? "bg-red-600 text-white"
                          : "border-gold text-gold"
                    }
                  >
                    {connectionStatus}
                  </Badge>
                </div>

                <div className="p-4 rounded-md bg-boxing-background border border-boxing-border">
                  <h3 className="mb-2 font-medium text-gold">WebSocket Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gold-light">URL:</span>
                    <span className="text-gold">ws://localhost:3001</span>

                    <span className="text-gold-light">Protocol:</span>
                    <span className="text-gold">WebSocket</span>

                    <span className="text-gold-light">Messages Received:</span>
                    <span className="text-gold">{rawMessages.length}</span>

                    <span className="text-gold-light">Last Message:</span>
                    <span className="text-gold">
                      {rawMessages.length > 0
                        ? new Date(rawMessages[rawMessages.length - 1].timestamp).toLocaleTimeString()
                        : "None"}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-md bg-boxing-background border border-boxing-border">
                  <h3 className="mb-2 font-medium text-gold flex items-center">
                    <Bug className="mr-2 h-4 w-4" />
                    Troubleshooting
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gold-light">If you're having connection issues:</p>
                    <ul className="list-disc list-inside text-gold-light">
                      <li>Check that your device is powered on</li>
                      <li>Verify the serial port settings</li>
                      <li>Ensure the WebSocket server is running</li>
                      <li>Try toggling the demo mode for testing</li>
                      <li>Check browser console for any errors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
