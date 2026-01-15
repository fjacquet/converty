export interface CaloriesBurnedInput {
  weight: number; // kg
  activity: string;
  duration: number; // minutes
}

// MET (Metabolic Equivalent of Task) values for various activities
const activityMets: Record<string, { name: string; met: number }> = {
  walking_slow: { name: "Walking (slow, 2 mph)", met: 2.0 },
  walking_moderate: { name: "Walking (moderate, 3 mph)", met: 3.5 },
  walking_fast: { name: "Walking (fast, 4 mph)", met: 5.0 },
  running_5mph: { name: "Running (5 mph, 12 min/mile)", met: 8.3 },
  running_6mph: { name: "Running (6 mph, 10 min/mile)", met: 9.8 },
  running_7mph: { name: "Running (7 mph, 8.5 min/mile)", met: 11.0 },
  running_8mph: { name: "Running (8 mph, 7.5 min/mile)", met: 11.8 },
  cycling_slow: { name: "Cycling (slow, 10 mph)", met: 4.0 },
  cycling_moderate: { name: "Cycling (moderate, 12-14 mph)", met: 8.0 },
  cycling_fast: { name: "Cycling (fast, 16-19 mph)", met: 12.0 },
  swimming_slow: { name: "Swimming (slow)", met: 5.8 },
  swimming_moderate: { name: "Swimming (moderate)", met: 7.0 },
  swimming_vigorous: { name: "Swimming (vigorous)", met: 10.0 },
  weightlifting_light: { name: "Weight lifting (light)", met: 3.0 },
  weightlifting_vigorous: { name: "Weight lifting (vigorous)", met: 6.0 },
  yoga: { name: "Yoga", met: 2.5 },
  pilates: { name: "Pilates", met: 3.0 },
  aerobics_low: { name: "Aerobics (low impact)", met: 5.0 },
  aerobics_high: { name: "Aerobics (high impact)", met: 7.3 },
  dancing: { name: "Dancing", met: 5.5 },
  hiking: { name: "Hiking", met: 6.0 },
  tennis: { name: "Tennis", met: 7.3 },
  basketball: { name: "Basketball", met: 6.5 },
  soccer: { name: "Soccer", met: 7.0 },
  rowing: { name: "Rowing machine", met: 7.0 },
  elliptical: { name: "Elliptical trainer", met: 5.0 },
  stair_climbing: { name: "Stair climbing", met: 8.0 },
  jump_rope: { name: "Jump rope", met: 12.3 },
  housework: { name: "Housework (moderate)", met: 3.5 },
  gardening: { name: "Gardening", met: 4.0 },
};

export interface CaloriesBurnedResult {
  caloriesBurned: number;
  caloriesPerMinute: number;
  activityName: string;
  met: number;
  equivalentWalking: number; // minutes of walking to burn same calories
  fatBurned: number; // grams
}

export function calculateCaloriesBurned(input: CaloriesBurnedInput): CaloriesBurnedResult | null {
  const { weight, activity, duration } = input;

  if (weight <= 0 || duration <= 0) {
    return null;
  }

  const activityData = activityMets[activity];
  if (!activityData) {
    return null;
  }

  // Calories burned = MET × weight (kg) × duration (hours)
  const durationHours = duration / 60;
  const caloriesBurned = activityData.met * weight * durationHours;
  const caloriesPerMinute = caloriesBurned / duration;

  // Calculate equivalent walking time (at 3.5 MET)
  const equivalentWalking = (caloriesBurned / (3.5 * weight)) * 60;

  // Fat burned (approximately 7700 calories per kg of fat)
  const fatBurned = (caloriesBurned / 7700) * 1000; // grams

  return {
    caloriesBurned,
    caloriesPerMinute,
    activityName: activityData.name,
    met: activityData.met,
    equivalentWalking,
    fatBurned,
  };
}

export function getAvailableActivities(): Array<{ id: string; name: string; met: number }> {
  return Object.entries(activityMets).map(([id, data]) => ({
    id,
    name: data.name,
    met: data.met,
  }));
}
