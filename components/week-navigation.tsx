"use client"

import { addDays, getWeekStart } from "@/lib/maintenance/schedule"

type WeekNavigationProps = {
  weekStart: string
  onChange: (weekStart: string) => void
}

const secondaryButton =
  "rounded-control border border-border-strong bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"

export default function WeekNavigation({
  weekStart,
  onChange,
}: WeekNavigationProps) {
  const currentWeek = getWeekStart()

  // Date arithmetic stays in the shared scheduler.
  function moveWeek(direction: number) {
    onChange(addDays(weekStart, direction * 7))
  }

  return (
    <nav
      aria-label="Choose a week"
      className="mb-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => moveWeek(-1)}
        className={secondaryButton}>
        Previous week
      </button>

      <button
        type="button"
        onClick={() => onChange(currentWeek)}
        aria-current={weekStart === currentWeek ? "date" : undefined}
        className="rounded-control bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
        This week
      </button>

      <button
        type="button"
        onClick={() => moveWeek(1)}
        className={secondaryButton}>
        Next week
      </button>
    </nav>
  )
}
