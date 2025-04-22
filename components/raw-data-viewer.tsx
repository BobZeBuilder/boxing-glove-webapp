import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "lucide-react"

interface RawMessage {
  type: "data" | "status" | "error"
  content: any
  timestamp: string
}

interface RawDataViewerProps {
  messages: RawMessage[]
}

export function RawDataViewer({ messages }: RawDataViewerProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
          <CardDescription>No messages received yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Terminal className="mr-2 h-5 w-5" />
          Raw Data
        </CardTitle>
        <CardDescription>Raw messages from the serial connection</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md border p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-0">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant={message.type === "error" ? "destructive" : message.type === "status" ? "outline" : "default"}
                >
                  {message.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <pre className="text-xs overflow-auto p-2 bg-muted rounded-md">
                {JSON.stringify(message.content, null, 2)}
              </pre>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
