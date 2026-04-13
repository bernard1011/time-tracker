export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function formatDurationShort(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)

  if (hrs > 0) {
    return `${hrs}h ${mins}m`
  }
  return `${mins}m`
}

export function parseDurationInput(input: string): number | null {
  // Handle hh:mm format
  const match = input.match(/^(\d{1,2}):(\d{2})$/)
  if (match) {
    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    if (minutes >= 60) return null
    return hours * 3600 + minutes * 60
  }
  return null
}

export function formatDurationForInput(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export function getStartOfDay(date: Date): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfDay(date: Date): Date {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

export function getStartOfWeek(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfWeek(date: Date): Date {
  const end = getStartOfWeek(date)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

export function getStartOfMonth(date: Date): Date {
  const start = new Date(date)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfMonth(date: Date): Date {
  const end = new Date(date)
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)
  end.setHours(23, 59, 59, 999)
  return end
}

export function getDateRange(filter: "day" | "week" | "month") {
  const now = new Date()

  switch (filter) {
    case "day":
      return { start: getStartOfDay(now), end: getEndOfDay(now) }
    case "week":
      return { start: getStartOfWeek(now), end: getEndOfWeek(now) }
    case "month":
      return { start: getStartOfMonth(now), end: getEndOfMonth(now) }
  }
}
