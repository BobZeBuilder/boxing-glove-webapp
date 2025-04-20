import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { SerialData, ConnectionStatusType } from "@/hooks/use-serial-data"
import { Bug, AlertCircle, Info } from "lucide-react"

interface RawMessage {
  type: "data" | "status" | "error"
  content: any
  timestamp: string
}

interface DebugPanelProps {
  data: SerialData | null
  connectionStatus: ConnectionStatusType
  rawMessages: RawMessage[]
}

export function DebugPanel({ data, connectionStatus, rawMessages }: DebugPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="mr-2 h-5 w-5" />
          Debug Panel
        </CardTitle>
        <CardDescription>Troubleshooting information for developers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="state">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="state" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Current application state and sensor data</AlertDescription>
            </Alert>

            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Current Data State</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2) || "No data available"}</pre>
            </div>
          </TabsContent>

          <TabsContent value="connection" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Connection status and details</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md bg-muted">
                <span>Connection Status:</span>
                <Badge
                  variant={
                    connectionStatus === "connected"
                      ? "default"
                      : connectionStatus === "error"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {connectionStatus}
                </Badge>
              </div>

              <div className="p-4 rounded-md bg-muted">
                <h3 className="mb-2 font-medium">WebSocket Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">URL:</span>
                  <span>ws://localhost:3001</span>

                  <span className="text-muted-foreground">Protocol:</span>
                  <span>WebSocket</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Last 5 messages for quick debugging</AlertDescription>
            </Alert>

            {rawMessages.length > 0 ? (
              <div className="space-y-2">
                {rawMessages.map((message, index) => (
                  <div key={index} className="p-2 rounded-md bg-muted text-xs">
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {message.type}
                      </Badge>
                      <span className="text-muted-foreground">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="overflow-auto">{JSON.stringify(message.content, null, 2)}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No messages received yet</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
