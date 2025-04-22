import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SerialData } from "@/hooks/use-serial-data"
import { Heart, Zap, Activity } from "lucide-react"

interface SensorReadingsProps {
  data: SerialData | null
}

export function SensorReadings({ data }: SensorReadingsProps) {
  // Helper function to normalize FSR values to percentage
  const normalizeValue = (value: number) => {
    if (value > 100) {
      return Math.min(100, Math.round((value / 1023) * 100))
    }
    return value
  }

  // Get heart rate zone
  const getHeartRateZone = (hr: number) => {
    if (hr < 60) return "Resting"
    if (hr < 110) return "Warm Up"
    if (hr < 140) return "Fat Burn"
    if (hr < 170) return "Cardio"
    return "Peak"
  }

  // Get color for heart rate zone
  const getHeartRateColor = (hr: number) => {
    if (hr < 60) return "text-green-500"
    if (hr < 110) return "text-blue-500"
    if (hr < 140) return "text-yellow-500"
    if (hr < 170) return "text-orange-500"
    return "text-red-500"
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Connect to your device or enable mock data to see sensor readings</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Normalize FSR values
  const indexValue = normalizeValue(data.fsrIndex)
  const middleValue = normalizeValue(data.fsrMiddle)
  const impactValue = normalizeValue(data.fsrImpact)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Heart Rate
          </CardTitle>
          <CardDescription>Current heart rate and zone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{data.heartRate} BPM</span>
            <span className={`font-medium ${getHeartRateColor(data.heartRate)}`}>
              {getHeartRateZone(data.heartRate)}
            </span>
          </div>
          <Progress value={Math.min(100, data.heartRate / 2)} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Accelerometer
          </CardTitle>
          <CardDescription>Motion sensor readings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">X-Axis</span>
              <span className="block text-xl font-medium">{data.accelerometer.x.toFixed(2)}</span>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Y-Axis</span>
              <span className="block text-xl font-medium">{data.accelerometer.y.toFixed(2)}</span>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Z-Axis</span>
              <span className="block text-xl font-medium">{data.accelerometer.z.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-1">
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Force Sensors
          </CardTitle>
          <CardDescription>Pressure readings from FSR sensors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Index Finger</span>
              <span className="text-sm font-medium">{indexValue}%</span>
            </div>
            <Progress value={indexValue} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Middle Finger</span>
              <span className="text-sm font-medium">{middleValue}%</span>
            </div>
            <Progress value={middleValue} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Impact Sensor</span>
              <span className="text-sm font-medium">{impactValue}%</span>
            </div>
            <Progress value={impactValue} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
