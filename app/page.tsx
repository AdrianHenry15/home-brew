"use client"

import { useState } from "react"
import HomeSetup from "@/components/home-setup"
import TaskChecklist from "@/components/task-checklist"
import WeekNavigation from "@/components/week-navigation"
import {
  defaultFeatures,
  getTasksForWeek,
  getWeekStart,
} from "@/lib/maintenance/schedule"
import type { HomeFeature } from "@/lib/maintenance/tasks"
import WeeklyProgress from "@/components/weekly-progress"

export default function Home() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart())
  const [features, setFeatures] = useState<HomeFeature[]>(() => [
    ...defaultFeatures,
  ])

  // Shared state stays here until we connect authenticated storage.
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const weeklyTasks = getTasksForWeek(weekStart, features)
  const isCurrentWeek = weekStart === getWeekStart()

  // Summarize only the tasks scheduled for the selected home and week.
  const { completedCount, remainingMinutes } = weeklyTasks.reduce(
    (summary, task) => {
      if (completedIds.includes(task.occurrenceId)) {
        summary.completedCount += 1
      } else {
        summary.remainingMinutes += task.minutes
      }

      return summary
    },
    { completedCount: 0, remainingMinutes: 0 },
  )

  function toggleTask(occurrenceId: string) {
    setCompletedIds((current) =>
      current.includes(occurrenceId)
        ? current.filter((id) => id !== occurrenceId)
        : [...current, occurrenceId],
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-option bg-primary font-bold text-primary-foreground">
            HB
          </span>

          <div>
            <p className="text-xl font-bold tracking-tight">HomeBrew</p>
            <p className="text-sm text-muted-foreground">
              A little upkeep, every week.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Your home, taken care of
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isCurrentWeek ? "This week" : "Weekly checklist"}
          </h1>

          <p className="mt-3 text-muted-foreground">
            A few small tasks to keep your home running smoothly.
          </p>
        </div>

        <HomeSetup features={features} onChange={setFeatures} />

        <WeekNavigation weekStart={weekStart} onChange={setWeekStart} />

        <div className="grid items-start gap-6 md:grid-cols-[1fr_280px]">
          <TaskChecklist
            weekStart={weekStart}
            tasks={weeklyTasks}
            completedIds={completedIds}
            onToggle={toggleTask}
          />

          <WeeklyProgress
            completedCount={completedCount}
            totalCount={weeklyTasks.length}
            remainingMinutes={remainingMinutes}
          />
        </div>
      </main>
    </div>
  )
}
