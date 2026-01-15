export interface WaterIntakeInput {
  weight: number; // kg
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athlete";
  climate: "temperate" | "hot" | "humid" | "cold";
  pregnant: boolean;
  breastfeeding: boolean;
}

export interface WaterIntakeResult {
  dailyIntakeMl: number;
  dailyIntakeLiters: number;
  dailyIntakeOz: number;
  dailyIntakeCups: number;
  hourlyReminder: number; // ml per hour (16 waking hours)
  breakdown: {
    baseNeeds: number;
    activityAddition: number;
    climateAddition: number;
    specialAddition: number;
  };
  tips: string[];
  schedule: Array<{
    time: string;
    amount: number;
    cumulative: number;
  }>;
}

export function calculateWaterIntake(input: WaterIntakeInput): WaterIntakeResult | null {
  const { weight, activityLevel, climate, pregnant, breastfeeding } = input;

  if (weight <= 0) {
    return null;
  }

  // Base water needs: 30-35ml per kg body weight
  const baseNeeds = weight * 33;

  // Activity level adjustment
  const activityAdditions: Record<string, number> = {
    sedentary: 0,
    light: 350,
    moderate: 500,
    active: 750,
    athlete: 1000,
  };
  const activityAddition = activityAdditions[activityLevel];

  // Climate adjustment
  const climateAdditions: Record<string, number> = {
    temperate: 0,
    hot: 500,
    humid: 400,
    cold: 200, // People often forget to drink in cold weather
  };
  const climateAddition = climateAdditions[climate];

  // Special conditions
  let specialAddition = 0;
  if (pregnant) specialAddition += 300;
  if (breastfeeding) specialAddition += 700;

  const dailyIntakeMl = baseNeeds + activityAddition + climateAddition + specialAddition;
  const dailyIntakeLiters = dailyIntakeMl / 1000;
  const dailyIntakeOz = dailyIntakeMl / 29.574;
  const dailyIntakeCups = dailyIntakeMl / 237;

  // Hourly reminder (assuming 16 waking hours)
  const hourlyReminder = Math.round(dailyIntakeMl / 16);

  // Drinking schedule
  const schedule = [
    { time: "7:00 AM", percent: 10 },
    { time: "9:00 AM", percent: 20 },
    { time: "11:00 AM", percent: 30 },
    { time: "1:00 PM", percent: 45 },
    { time: "3:00 PM", percent: 60 },
    { time: "5:00 PM", percent: 75 },
    { time: "7:00 PM", percent: 90 },
    { time: "9:00 PM", percent: 100 },
  ].map((item, index, arr) => {
    const prevPercent = index > 0 ? arr[index - 1].percent : 0;
    return {
      time: item.time,
      amount: Math.round(((item.percent - prevPercent) / 100) * dailyIntakeMl),
      cumulative: Math.round((item.percent / 100) * dailyIntakeMl),
    };
  });

  const tips = [
    "Drink a glass of water first thing in the morning",
    "Carry a reusable water bottle with you",
    "Set reminders on your phone to drink water",
    "Drink water before, during, and after exercise",
    "Eat water-rich foods like fruits and vegetables",
    "Drink a glass of water before each meal",
    "Monitor your urine color - pale yellow is ideal",
  ];

  return {
    dailyIntakeMl,
    dailyIntakeLiters,
    dailyIntakeOz,
    dailyIntakeCups,
    hourlyReminder,
    breakdown: {
      baseNeeds,
      activityAddition,
      climateAddition,
      specialAddition,
    },
    tips,
    schedule,
  };
}
