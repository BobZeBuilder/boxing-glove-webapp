import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Activity, History, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gold">
              BoxSense
            </h1>
            <p className="mx-auto max-w-[700px] text-white/70 md:text-xl">
              Advanced boxing performance analysis with real-time sensor feedback
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button className="bg-gold text-black hover:bg-gold/90">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="flex flex-col items-center space-y-2 border border-gold/20 p-6 rounded-lg">
            <div className="p-2 bg-gold/10 rounded-full">
              <Activity className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-xl font-bold text-gold">Real-time Analysis</h2>
            <p className="text-white/70 text-center">
              Get instant feedback on your punches, force, and technique as you train
            </p>
            <Link href="/dashboard" className="text-gold hover:underline mt-2">
              View Dashboard
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-2 border border-gold/20 p-6 rounded-lg">
            <div className="p-2 bg-gold/10 rounded-full">
              <History className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-xl font-bold text-gold">Training History</h2>
            <p className="text-white/70 text-center">
              Track your progress over time and identify areas for improvement
            </p>
            <Link href="/history" className="text-gold hover:underline mt-2">
              View History
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-2 border border-gold/20 p-6 rounded-lg">
            <div className="p-2 bg-gold/10 rounded-full">
              <Settings className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-xl font-bold text-gold">Customizable Settings</h2>
            <p className="text-white/70 text-center">
              Personalize your experience with custom profiles and sensor calibration
            </p>
            <Link href="/settings" className="text-gold hover:underline mt-2">
              Configure Settings
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-2 border border-gold/20 p-6 rounded-lg">
            <div className="p-2 bg-gold/10 rounded-full">
              <Settings className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-xl font-bold text-gold">Serial Monitor</h2>
            <p className="text-white/70 text-center">
              good luck
            </p>
            <Link href="/serial" className="text-gold hover:underline mt-2">
              Serial Monitor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
