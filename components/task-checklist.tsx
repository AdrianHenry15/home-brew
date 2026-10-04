"use client"

import { formatWeek, type ScheduledTask } from "@/lib/maintenance/schedule"

type TaskChecklistProps = {
  weekStart: string
  tasks: ScheduledTask[]
  completedIds: string[]
  onToggle: (occurrenceId: string) => void
}

export default function TaskChecklist({
  weekStart,
  tasks,
  completedIds,
  onToggle,
}: TaskChecklistProps) {
  return (
    <section
      aria-label="Weekly maintenance checklist"
      className="overflow-hidden rounded-panel border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">Your checklist</h2>

        <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
          {formatWeek(weekStart)} · {tasks.length} tasks
        </p>
      </div>

      {tasks.length === 0 ? (
        <p className="p-5 text-muted-foreground">
          No maintenance tasks scheduled for this week.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {tasks.map((task) => {
            const isComplete = completedIds.includes(task.occurrenceId)

            return (
              // Each recurrence has its own completion state and element ID.
              <div
                key={task.occurrenceId}
                className={`p-5 transition-colors ${
                  isComplete ? "bg-muted" : "bg-surface"
                }`}>
                <div className="flex items-start gap-4">
                  <input
                    id={task.occurrenceId}
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => onToggle(task.occurrenceId)}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary"
                  />

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor={task.occurrenceId}
                      className={`cursor-pointer text-base font-semibold ${
                        isComplete
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}>
                      {task.title}
                    </label>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{task.category}</span>
                      <span>{task.frequency}</span>
                      <span>About {task.minutes} min</span>
                    </div>

                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-accent-foreground">
                        How to do it
                      </summary>

                      <p className="mt-2 leading-relaxed text-muted-foreground">
                        {task.instructions}
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
