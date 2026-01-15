export interface TargetHeartRateInput {
  age: number;
  restingHeartRate?: number;
}

export interface TargetHeartRateResult {
  maxHeartRate: number;
  zones: Array<{
    name: string;
    minPercent: number;
    maxPercent: number;
    minBpm: number;
    maxBpm: number;
    description: string;
  }>;
  fatBurningZone: { min: number; max: number };
  cardioZone: { min: number; max: number };
  heartRateReserve?: number;
}

export function calculateTargetHeartRate(
  input: TargetHeartRateInput
): TargetHeartRateResult | null {
  const { age, restingHeartRate } = input;

  if (age <= 0 || age > 120) {
    return null;
  }

  // Maximum Heart Rate (Tanaka formula, more accurate than 220-age)
  const maxHeartRate = 208 - 0.7 * age;

  // Heart Rate Reserve (Karvonen method) if resting HR provided
  const heartRateReserve = restingHeartRate ? maxHeartRate - restingHeartRate : undefined;

  // Calculate zones
  const calculateZone = (minPercent: number, maxPercent: number) => {
    if (heartRateReserve && restingHeartRate) {
      // Karvonen formula: THR = (HRR × %intensity) + HRrest
      return {
        min: Math.round(heartRateReserve * (minPercent / 100) + restingHeartRate),
        max: Math.round(heartRateReserve * (maxPercent / 100) + restingHeartRate),
      };
    }
    // Simple percentage of max HR
    return {
      min: Math.round(maxHeartRate * (minPercent / 100)),
      max: Math.round(maxHeartRate * (maxPercent / 100)),
    };
  };

  const zones = [
    {
      name: "Recovery",
      minPercent: 50,
      maxPercent: 60,
      ...calculateZone(50, 60),
      minBpm: calculateZone(50, 60).min,
      maxBpm: calculateZone(50, 60).max,
      description: "Very light activity, warm-up, cool-down",
    },
    {
      name: "Fat Burning",
      minPercent: 60,
      maxPercent: 70,
      ...calculateZone(60, 70),
      minBpm: calculateZone(60, 70).min,
      maxBpm: calculateZone(60, 70).max,
      description: "Light activity, best for fat burning",
    },
    {
      name: "Aerobic",
      minPercent: 70,
      maxPercent: 80,
      ...calculateZone(70, 80),
      minBpm: calculateZone(70, 80).min,
      maxBpm: calculateZone(70, 80).max,
      description: "Moderate activity, improves cardiovascular fitness",
    },
    {
      name: "Anaerobic",
      minPercent: 80,
      maxPercent: 90,
      ...calculateZone(80, 90),
      minBpm: calculateZone(80, 90).min,
      maxBpm: calculateZone(80, 90).max,
      description: "Hard activity, increases performance",
    },
    {
      name: "Maximum",
      minPercent: 90,
      maxPercent: 100,
      ...calculateZone(90, 100),
      minBpm: calculateZone(90, 100).min,
      maxBpm: calculateZone(90, 100).max,
      description: "Maximum effort, short bursts only",
    },
  ];

  return {
    maxHeartRate: Math.round(maxHeartRate),
    zones,
    fatBurningZone: calculateZone(60, 70),
    cardioZone: calculateZone(70, 80),
    heartRateReserve: heartRateReserve ? Math.round(heartRateReserve) : undefined,
  };
}
