type WeeklyProgressProps = {
  completedCount: number
  totalCount: number
  remainingMinutes: number
}

export default function WeeklyProgress({
  completedCount,
  totalCount,
  remainingMinutes,
}: WeeklyProgressProps) {
  // Progress is derived from counts, not stored as separate state.
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <aside className="rounded-panel bg-progress p-6 text-progress-foreground">
      <h2 className="font-semibold">Weekly progress</h2>

      <p className="mt-5 text-4xl font-bold">{progress}%</p>

      <p className="mt-2 text-sm text-progress-muted" aria-live="polite">
        {completedCount} of {totalCount} tasks complete
      </p>

      <div
        role="progressbar"
        aria-label="Weekly tasks completed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-5 h-2 overflow-hidden rounded-full bg-progress-track">
        <div
          className="h-full rounded-full bg-progress-fill transition-[width] motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 border-t border-progress-track pt-5">
        {totalCount === 0 ? (
          <p className="text-sm text-progress-muted">
            Nothing scheduled this week.
          </p>
        ) : completedCount === totalCount ? (
          <p className="font-medium">All done. Enjoy your home.</p>
        ) : (
          <>
            <p className="text-sm text-progress-muted">
              Estimated time remaining
            </p>

            <p className="mt-1 text-xl font-semibold">
              {remainingMinutes} minutes
            </p>
          </>
        )}
      </div>
    </aside>
  )
}
