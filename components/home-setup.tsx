"use client"

import type { HomeFeature } from "@/lib/maintenance/tasks"

type HomeSetupProps = {
  features: HomeFeature[]
  onChange: (features: HomeFeature[]) => void
}

const featureOptions: { id: HomeFeature; label: string }[] = [
  { id: "hvac", label: "Central HVAC" },
  { id: "dishwasher", label: "Dishwasher" },
  { id: "dryer", label: "Dryer" },
  { id: "waterHeater", label: "Water heater" },
  { id: "lawn", label: "Lawn" },
  { id: "irrigation", label: "Sprinkler system" },
  { id: "garage", label: "Automatic garage door" },
  { id: "fireplace", label: "Wood-burning fireplace" },
  { id: "septic", label: "Septic system" },
  { id: "sumpPump", label: "Sump pump" },
  { id: "rainwater", label: "Rainwater collection" },
  { id: "pool", label: "Pool" },
]

export default function HomeSetup({ features, onChange }: HomeSetupProps) {
  function toggleFeature(feature: HomeFeature) {
    // Parent state also drives the weekly task schedule.
    onChange(
      features.includes(feature)
        ? features.filter((item) => item !== feature)
        : [...features, feature],
    )
  }

  return (
    <details className="mb-6 rounded-panel border border-border bg-surface">
      <summary className="cursor-pointer px-5 py-4 font-semibold">
        Your home setup
        <span className="ml-3 text-sm font-normal text-muted-foreground">
          {features.length} selected
        </span>
      </summary>

      <div className="border-t border-border p-5">
        <fieldset>
          <legend className="mb-4 text-muted-foreground">
            Select what your home has. We’ll include the relevant maintenance
            tasks.
          </legend>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featureOptions.map((option) => {
              const isSelected = features.includes(option.id)

              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-option border p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border bg-surface hover:bg-surface-hover"
                  }`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFeature(option.id)}
                    className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                  />

                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <p className="mt-4 text-sm text-muted-foreground">
          General safety, plumbing, and exterior tasks are always included.
        </p>
      </div>
    </details>
  )
}
