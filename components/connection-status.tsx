import { Badge } from "@/components/ui/badge"
import type { ConnectionStatusType } from "@/hooks/use-serial-data"

interface ConnectionStatusProps {
  status: ConnectionStatusType
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
  let label = "Unknown"

  switch (status) {
    case "connected":
      variant = "default"
      label = "Connected"
      break
    case "connecting":
      variant = "secondary"
      label = "Connecting..."
      break
    case "disconnected":
      variant = "outline"
      label = "Disconnected"
      break
    case "error":
      variant = "destructive"
      label = "Error"
      break
  }

  return (
    <Badge variant={variant} className="text-sm py-1 px-3">
      {label}
    </Badge>
  )
}
