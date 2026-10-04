export type Category =
  | "Safety"
  | "Plumbing"
  | "HVAC"
  | "Appliances"
  | "Exterior"
  | "Outdoors"

export type HomeFeature =
  | "hvac"
  | "dishwasher"
  | "dryer"
  | "waterHeater"
  | "lawn"
  | "irrigation"
  | "garage"
  | "fireplace"
  | "septic"
  | "sumpPump"
  | "rainwater"
  | "pool"

export type Schedule =
  | {
      kind: "weekly"
      months?: number[]
    }
  | {
      kind: "monthly"
      // Distribute tasks across the month: 0, 7, 14, or 21.
      dayOffset: number
    }
  | {
      kind: "quarterly"
      // Months are 1–12.
      startMonth: number
      dayOffset: number
    }
  | {
      kind: "seasonal"
      months: number[]
      dayOffset: number
    }
  | {
      kind: "annual"
      month: number
      dayOffset: number
    }

export type MaintenanceTask = {
  id: string
  title: string
  category: Category
  minutes: number
  frequency: string
  instructions: string
  schedule: Schedule
  feature?: HomeFeature
}

function task(
  id: string,
  title: string,
  category: Category,
  minutes: number,
  schedule: Schedule,
  instructions: string,
  feature?: HomeFeature,
): MaintenanceTask {
  const labels: Record<Schedule["kind"], string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    seasonal: "Seasonal",
    annual: "Yearly",
  }

  return {
    id,
    title,
    category,
    minutes,
    schedule,
    instructions,
    feature,
    frequency: labels[schedule.kind],
  }
}

const weekly: Schedule = { kind: "weekly" }

const monthly = (dayOffset: number): Schedule => ({
  kind: "monthly",
  dayOffset,
})

const quarterly = (startMonth: number, dayOffset: number): Schedule => ({
  kind: "quarterly",
  startMonth,
  dayOffset,
})

const seasonal = (months: number[], dayOffset: number): Schedule => ({
  kind: "seasonal",
  months,
  dayOffset,
})

const annual = (month: number, dayOffset: number): Schedule => ({
  kind: "annual",
  month,
  dayOffset,
})

export const maintenanceTasks: MaintenanceTask[] = [
  // WEEKLY
  task(
    "check-leaks",
    "Check for water leaks",
    "Plumbing",
    10,
    weekly,
    "Look under sinks, around toilets, and near appliances for moisture or drips.",
  ),
  task(
    "exterior-walk",
    "Walk the yard and exterior",
    "Outdoors",
    15,
    weekly,
    "Pick up debris and check paths, fences, standing water, and visible storm damage.",
  ),
  task(
    "lawn-care",
    "Mow and edge as needed",
    "Outdoors",
    40,
    { kind: "weekly", months: [3, 4, 5, 6, 7, 8, 9, 10] },
    "Mow when your grass is actively growing. Adjust to grass type, weather, and local watering restrictions.",
    "lawn",
  ),
  task(
    "pool-check",
    "Inspect pool equipment",
    "Outdoors",
    15,
    weekly,
    "Check circulation, baskets, and visible leaks. Follow a separate water-testing and treatment schedule.",
    "pool",
  ),

  // MONTHLY
  task(
    "hvac-filter",
    "Inspect the HVAC filter",
    "HVAC",
    10,
    monthly(0),
    "Inspect for dirt and airflow restriction. Replace according to the filter label and equipment instructions.",
    "hvac",
  ),
  task(
    "alarm-test",
    "Test smoke and CO alarms",
    "Safety",
    10,
    monthly(0),
    "Use each alarm’s test button according to its instructions. Check replacement dates.",
  ),
  task(
    "range-hood",
    "Clean range hood filters",
    "Appliances",
    20,
    monthly(7),
    "Clean removable filters according to the manual. Replace disposable filters on their recommended schedule.",
  ),
  task(
    "extinguishers",
    "Check fire extinguishers",
    "Safety",
    5,
    monthly(7),
    "Check the gauge, accessibility, visible condition, and service date.",
  ),
  task(
    "gfci-test",
    "Test GFCI outlets",
    "Safety",
    10,
    monthly(14),
    "Use TEST and RESET according to the outlet instructions. Contact an electrician if an outlet fails.",
  ),
  task(
    "dishwasher-filter",
    "Clean the dishwasher filter",
    "Appliances",
    15,
    monthly(14),
    "Remove and rinse the filter as instructed in the manual, then wipe the door seals.",
    "dishwasher",
  ),
  task(
    "washer-clean",
    "Clean the washing machine",
    "Appliances",
    20,
    monthly(21),
    "Clean the dispenser and seals, then run the manufacturer’s recommended cleaning cycle.",
  ),
  task(
    "drain-check",
    "Clean drain strainers",
    "Plumbing",
    10,
    monthly(21),
    "Remove hair and debris from accessible strainers. Investigate drains that repeatedly run slowly.",
  ),
  task(
    "garage-safety",
    "Check garage door safety",
    "Safety",
    15,
    monthly(7),
    "Follow the manual to test safety sensors and reversal. Leave springs and cables to a professional.",
    "garage",
  ),
  task(
    "irrigation-check",
    "Check sprinkler heads and leaks",
    "Outdoors",
    15,
    seasonal([3, 4, 5, 6, 7, 8, 9, 10], 14),
    "Run a brief zone check. Look for broken heads, leaks, and overspray; adjust to rainfall.",
    "irrigation",
  ),
  task(
    "rainwater-check",
    "Inspect rainwater storage",
    "Outdoors",
    15,
    monthly(21),
    "Check screens, covers, overflow, and mosquito protection. Follow your system’s cleaning instructions.",
    "rainwater",
  ),

  // QUARTERLY
  task(
    "fridge-coils",
    "Inspect and clean refrigerator coils",
    "Appliances",
    30,
    quarterly(1, 0),
    "Follow the manual for accessible coil cleaning and disconnecting power. Some models need a different interval.",
  ),
  task(
    "caulk-check",
    "Inspect bathroom caulk and grout",
    "Plumbing",
    15,
    quarterly(1, 7),
    "Check showers, tubs, and sink edges for gaps, loose grout, and moisture damage.",
  ),
  task(
    "pest-check",
    "Check for pest activity",
    "Exterior",
    15,
    quarterly(1, 14),
    "Look for droppings, damaged wood, and entry gaps. Get professional help for suspected termites.",
  ),
  task(
    "window-seals",
    "Inspect doors and window seals",
    "Exterior",
    20,
    quarterly(1, 21),
    "Check weatherstripping, locks, and visible gaps for drafts or water entry.",
  ),
  task(
    "gutter-inspection",
    "Inspect gutters and downspouts",
    "Exterior",
    15,
    quarterly(2, 0),
    "Inspect from the ground for sagging, overflow, and blocked drainage. Also check after major storms.",
  ),
  task(
    "foundation-check",
    "Inspect foundation and drainage",
    "Exterior",
    20,
    quarterly(2, 7),
    "Look for new cracks, pooling water, and soil sloping toward the house. Document changes.",
  ),
  task(
    "water-heater-check",
    "Inspect the water heater for leaks",
    "Plumbing",
    10,
    quarterly(2, 14),
    "Look around the tank and visible connections for leaks or corrosion. Follow the equipment manual.",
    "waterHeater",
  ),
  task(
    "dryer-exhaust",
    "Check dryer exhaust airflow",
    "Appliances",
    15,
    quarterly(2, 21),
    "Check the exterior exhaust for blockage and lint. Clean the lint screen before every load.",
    "dryer",
  ),
  task(
    "bathroom-fans",
    "Clean bathroom fan covers",
    "HVAC",
    20,
    quarterly(3, 0),
    "Turn off power and clean covers according to the manual. Check for persistent condensation.",
  ),
  task(
    "showerheads",
    "Clean showerheads and aerators",
    "Plumbing",
    20,
    quarterly(3, 7),
    "Remove mineral buildup with a cleaner suitable for the fixture’s finish.",
  ),
  task(
    "emergency-supplies",
    "Review emergency supplies",
    "Safety",
    20,
    quarterly(3, 14),
    "Review first aid supplies, flashlights, water, emergency contacts, and expiration dates.",
  ),
  task(
    "exterior-lights",
    "Check outdoor lighting",
    "Safety",
    10,
    quarterly(3, 21),
    "Check entry and path lights. Inspect visible damage to weatherproof covers.",
  ),
  task(
    "sump-pump",
    "Test the sump pump",
    "Plumbing",
    15,
    quarterly(3, 7),
    "Test according to the manual and review backup power. Recheck before expected heavy rain.",
    "sumpPump",
  ),
  task(
    "rainwater-filters",
    "Clean rainwater prefilters",
    "Outdoors",
    20,
    quarterly(2, 7),
    "Clean prefilters and the first-flush diverter according to system instructions.",
    "rainwater",
  ),

  // SEASONAL — starting schedule for a southeastern home
  task(
    "spring-hvac",
    "Schedule spring HVAC service",
    "HVAC",
    15,
    seasonal([3], 0),
    "Arrange professional service before cooling season. Follow your system’s maintenance requirements.",
    "hvac",
  ),
  task(
    "fall-hvac",
    "Schedule fall HVAC service",
    "HVAC",
    15,
    seasonal([10], 0),
    "Arrange professional service before heating season.",
    "hvac",
  ),
  task(
    "gutter-cleaning",
    "Clean gutters and downspouts",
    "Exterior",
    60,
    seasonal([4, 11], 14),
    "Clear debris and confirm drainage away from the foundation. Hire help when access is unsafe.",
  ),
  task(
    "roof-inspection",
    "Inspect the roof from the ground",
    "Exterior",
    20,
    seasonal([4, 10], 7),
    "Look for missing shingles, visible flashing damage, or sagging. Use a roofer for close inspection.",
  ),
  task(
    "storm-plan",
    "Review your severe-weather plan",
    "Safety",
    20,
    seasonal([3], 21),
    "Review shelter locations, weather alerts, emergency contacts, and evacuation needs.",
  ),
  task(
    "deck-check",
    "Inspect decks and railings",
    "Exterior",
    25,
    seasonal([5], 7),
    "Check for loose boards, rotten wood, and unstable railings before heavy use.",
  ),
  task(
    "tree-check",
    "Inspect trees for visible hazards",
    "Outdoors",
    20,
    seasonal([3, 9], 14),
    "Look from the ground for broken limbs or leaning trees. Ask an arborist about hazards.",
  ),
  task(
    "freeze-prep",
    "Prepare outdoor faucets for freezing weather",
    "Plumbing",
    20,
    seasonal([11], 21),
    "Disconnect hoses before freezing weather and protect vulnerable fixtures according to their design.",
  ),
  task(
    "irrigation-winter",
    "Review sprinkler winterization needs",
    "Outdoors",
    15,
    seasonal([11], 7),
    "Ask your installer whether the system needs winterization. Arrange professional service when necessary.",
    "irrigation",
  ),

  // ANNUAL
  task(
    "home-inventory",
    "Update your home inventory",
    "Safety",
    30,
    annual(1, 7),
    "Update photos and major purchase records, then review insurance coverage.",
  ),
  task(
    "shutoff-review",
    "Locate shutoffs and review emergency steps",
    "Safety",
    15,
    annual(1, 21),
    "Make sure household members can locate the main water shutoff and labeled breaker panel.",
  ),
  task(
    "dryer-vent-clean",
    "Arrange a full dryer vent cleaning",
    "Appliances",
    15,
    annual(2, 7),
    "Clean the entire exhaust path or arrange professional cleaning. Address slow drying sooner.",
    "dryer",
  ),
  task(
    "supply-hoses",
    "Inspect appliance supply hoses",
    "Plumbing",
    15,
    annual(2, 21),
    "Look for cracks, corrosion, bulges, and leaks. Follow manufacturer replacement guidance.",
  ),
  task(
    "water-heater-service",
    "Review water heater service needs",
    "Plumbing",
    15,
    annual(6, 0),
    "Review the manual for flushing and inspection requirements. Arrange a plumber for unfamiliar procedures.",
    "waterHeater",
  ),
  task(
    "chimney-inspection",
    "Schedule a chimney inspection",
    "Safety",
    15,
    annual(9, 7),
    "Arrange an inspection and cleaning as needed before using the fireplace.",
    "fireplace",
  ),
  task(
    "septic-review",
    "Review septic inspection and pumping records",
    "Plumbing",
    15,
    annual(6, 14),
    "Check service records and arrange service when due. Pumping frequency depends on the system and household.",
    "septic",
  ),
]
