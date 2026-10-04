import {
  maintenanceTasks,
  type HomeFeature,
  type MaintenanceTask,
} from "./tasks"

export type ScheduledTask = MaintenanceTask & {
  occurrenceId: string
  dueDate: string
}

export const defaultFeatures: HomeFeature[] = [
  "hvac",
  "dishwasher",
  "dryer",
  "waterHeater",
  "lawn",
]

// UTC is used only for date-only arithmetic.
// These dates do not represent appointment times.
function parseDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    throw new Error("Expected a date in YYYY-MM-DD format.")
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Invalid calendar date.")
  }

  return date
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function todayKey(): string {
  const now = new Date()

  // Read the visitor's local calendar date.
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
}

export function addDays(value: string, days: number): string {
  const date = parseDate(value)
  date.setUTCDate(date.getUTCDate() + days)
  return dateKey(date)
}

export function getWeekStart(value = todayKey()): string {
  const date = parseDate(value)

  const daysSinceMonday = (date.getUTCDay() + 6) % 7

  date.setUTCDate(date.getUTCDate() - daysSinceMonday)

  return dateKey(date)
}

export function formatWeek(value: string): string {
  const start = getWeekStart(value)
  const end = addDays(start, 6)

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

  return `${formatter.format(parseDate(start))} – ${formatter.format(
    parseDate(end),
  )}`
}

function monthMatches(task: MaintenanceTask, month: number): boolean {
  const schedule = task.schedule

  switch (schedule.kind) {
    case "monthly":
      return true

    case "quarterly":
      return (month - schedule.startMonth + 12) % 3 === 0

    case "seasonal":
      return schedule.months.includes(month)

    case "annual":
      return schedule.month === month

    case "weekly":
      return false
  }
}

export function getTasksForWeek(
  value: string,
  features: readonly HomeFeature[] = defaultFeatures,
): ScheduledTask[] {
  const weekStart = getWeekStart(value)
  const weekEnd = addDays(weekStart, 6)

  const startDate = parseDate(weekStart)
  const endDate = parseDate(weekEnd)

  // A week can span two months or two years.
  const months = [
    {
      year: startDate.getUTCFullYear(),
      month: startDate.getUTCMonth() + 1,
    },
  ]

  if (
    startDate.getUTCFullYear() !== endDate.getUTCFullYear() ||
    startDate.getUTCMonth() !== endDate.getUTCMonth()
  ) {
    months.push({
      year: endDate.getUTCFullYear(),
      month: endDate.getUTCMonth() + 1,
    })
  }

  const result: ScheduledTask[] = []

  for (const task of maintenanceTasks) {
    if (task.feature && !features.includes(task.feature)) {
      continue
    }

    const schedule = task.schedule

    if (schedule.kind === "weekly") {
      // Use Thursday as the representative day of this week.
      const representativeMonth =
        parseDate(addDays(weekStart, 3)).getUTCMonth() + 1

      if (schedule.months && !schedule.months.includes(representativeMonth)) {
        continue
      }

      result.push({
        ...task,
        dueDate: weekStart,
        occurrenceId: `${task.id}:${weekStart}`,
      })

      continue
    }

    for (const { year, month } of months) {
      if (!monthMatches(task, month)) {
        continue
      }

      const dueDate = dateKey(
        new Date(Date.UTC(year, month - 1, 1 + schedule.dayOffset)),
      )

      if (dueDate >= weekStart && dueDate <= weekEnd) {
        result.push({
          ...task,
          dueDate,
          occurrenceId: `${task.id}:${dueDate}`,
        })
      }
    }
  }

  return result.sort(
    (a, b) =>
      a.dueDate.localeCompare(b.dueDate) ||
      a.category.localeCompare(b.category) ||
      a.title.localeCompare(b.title),
  )
}

export function getYearSchedule(
  year: number,
  features: readonly HomeFeature[] = defaultFeatures,
) {
  const weeks: {
    weekStart: string
    tasks: ScheduledTask[]
  }[] = []

  // Include every week that overlaps this calendar year.
  let weekStart = getWeekStart(`${year}-01-01`)
  const lastDay = `${year}-12-31`

  while (weekStart <= lastDay) {
    weeks.push({
      weekStart,
      tasks: getTasksForWeek(weekStart, features),
    })

    weekStart = addDays(weekStart, 7)
  }

  return weeks
}
