import { ActiveTimer } from "@/components/timer/ActiveTimer"
import { TimeEntryList } from "@/components/timer/TimeEntryList"

export default function TimerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Time Tracker</h1>
        <p className="mt-1 text-muted-foreground">
          Track your time and stay productive
        </p>
      </div>

      <ActiveTimer />

      <TimeEntryList />
    </div>
  )
}
