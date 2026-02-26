import { z } from "zod";

// ─── Army Body Fat ───────────────────────────────────────────────────────────
export const ArmyBodyFatFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(17, "Age must be at least 17")
    .max(60, "Age must be 60 or under"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(250, "Height exceeds maximum (250 cm)"),
  neck: z.coerce
    .number({ error: "Neck circumference must be a number" })
    .positive("Neck circumference must be positive")
    .max(100, "Neck circumference exceeds maximum (100 cm)"),
  waist: z.coerce
    .number({ error: "Waist circumference must be a number" })
    .positive("Waist circumference must be positive")
    .max(250, "Waist circumference exceeds maximum (250 cm)"),
  hip: z.coerce
    .number({ error: "Hip circumference must be a number" })
    .positive("Hip circumference must be positive")
    .max(250, "Hip circumference exceeds maximum (250 cm)"),
});

// ─── BMI ─────────────────────────────────────────────────────────────────────
export const BmiFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  weightUnit: z.enum(["kg", "lb"]),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  heightUnit: z.enum(["cm", "m", "in", "ft"]),
});

// ─── BMR ─────────────────────────────────────────────────────────────────────
export const BmrFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .positive("Age must be positive")
    .max(130, "Age exceeds maximum (130)"),
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
});

// ─── Body Fat ─────────────────────────────────────────────────────────────────
export const BodyFatFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .positive("Age must be positive")
    .max(130, "Age exceeds maximum (130)"),
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  neck: z.coerce
    .number({ error: "Neck circumference must be a number" })
    .positive("Neck circumference must be positive")
    .max(100, "Neck circumference exceeds maximum (100 cm)"),
  waist: z.coerce
    .number({ error: "Waist circumference must be a number" })
    .positive("Waist circumference must be positive")
    .max(250, "Waist circumference exceeds maximum (250 cm)"),
  hip: z.coerce
    .number({ error: "Hip circumference must be a number" })
    .positive("Hip circumference must be positive")
    .max(250, "Hip circumference exceeds maximum (250 cm)"),
});

// ─── Body Surface Area ───────────────────────────────────────────────────────
export const BodySurfaceAreaFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
});

// ─── Body Type ───────────────────────────────────────────────────────────────
export const BodyTypeFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  wristCircumference: z.coerce
    .number({ error: "Wrist circumference must be a number" })
    .positive("Wrist circumference must be positive")
    .max(50, "Wrist circumference exceeds maximum (50 cm)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  shoulderWidth: z.coerce
    .number({ error: "Shoulder width must be a number" })
    .positive("Shoulder width must be positive")
    .max(100, "Shoulder width exceeds maximum (100 cm)"),
  hipWidth: z.coerce
    .number({ error: "Hip width must be a number" })
    .positive("Hip width must be positive")
    .max(100, "Hip width exceeds maximum (100 cm)"),
});

// ─── Calorie Calculator ───────────────────────────────────────────────────────
export const CalorieFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .positive("Age must be positive")
    .max(130, "Age exceeds maximum (130)"),
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
  targetWeight: z.coerce
    .number({ error: "Target weight must be a number" })
    .positive("Target weight must be positive")
    .max(1000, "Target weight exceeds maximum (1000 kg)"),
  weeksToGoal: z.coerce
    .number({ error: "Weeks to goal must be a number" })
    .positive("Weeks to goal must be positive")
    .max(520, "Weeks to goal exceeds maximum (520 weeks)"),
});

// ─── Calories Burned ─────────────────────────────────────────────────────────
export const CaloriesBurnedFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  activity: z.string().min(1, "Activity must be selected"),
  duration: z.coerce
    .number({ error: "Duration must be a number" })
    .positive("Duration must be positive")
    .max(1440, "Duration exceeds maximum (1440 minutes)"),
});

// ─── Carb Calculator ─────────────────────────────────────────────────────────
export const CarbFormSchema = z.object({
  calories: z.coerce
    .number({ error: "Calories must be a number" })
    .positive("Calories must be positive")
    .max(10000, "Calories exceed maximum (10000 kcal)"),
  goal: z.enum(["weightLoss", "maintenance", "muscleGain", "keto", "lowCarb", "athlete"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "athlete"]),
});

// ─── Corpulence ──────────────────────────────────────────────────────────────
// Note: CorpulenceCalculator uses useState directly (not createCalculatorStore)
// Schema included for completeness but not wired to a store
export const CorpulenceFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
});

// ─── Due Date Calculator ──────────────────────────────────────────────────────
export const DueDateFormSchema = z.object({
  calculationMethod: z.enum(["lmp", "conception", "ultrasound", "ivf"]),
  date: z.string().min(1, "Date is required"),
  cycleLength: z.coerce
    .number({ error: "Cycle length must be a number" })
    .int("Cycle length must be a whole number")
    .min(21, "Cycle length must be at least 21 days")
    .max(40, "Cycle length must be 40 days or less"),
  ultrasoundWeeks: z.coerce
    .number({ error: "Ultrasound weeks must be a number" })
    .int("Ultrasound weeks must be a whole number")
    .min(0, "Ultrasound weeks cannot be negative")
    .max(42, "Ultrasound weeks must be 42 or less"),
  ultrasoundDays: z.coerce
    .number({ error: "Ultrasound days must be a number" })
    .int("Ultrasound days must be a whole number")
    .min(0, "Ultrasound days cannot be negative")
    .max(6, "Ultrasound days must be 6 or less"),
});

// ─── Fat Intake Calculator ────────────────────────────────────────────────────
export const FatIntakeFormSchema = z.object({
  calories: z.coerce
    .number({ error: "Calories must be a number" })
    .positive("Calories must be positive")
    .max(10000, "Calories exceed maximum (10000 kcal)"),
  goal: z.enum(["weightLoss", "maintenance", "muscleGain", "keto", "lowFat"]),
});

// ─── GFR Calculator ───────────────────────────────────────────────────────────
export const GfrFormSchema = z.object({
  creatinine: z.coerce
    .number({ error: "Creatinine must be a number" })
    .positive("Creatinine must be positive")
    .max(50, "Creatinine exceeds maximum (50 mg/dL)"),
  creatinineUnit: z.enum(["mgdl", "umol"]),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(18, "Age must be at least 18")
    .max(130, "Age exceeds maximum (130)"),
  gender: z.enum(["male", "female"]),
  race: z.enum(["black", "other"]),
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
});

// ─── Healthy Weight Calculator ────────────────────────────────────────────────
export const HealthyWeightFormSchema = z.object({
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(130, "Age exceeds maximum (130)"),
  gender: z.enum(["male", "female"]),
  frameSize: z.enum(["small", "medium", "large"]),
});

// ─── Ideal Weight Calculator ──────────────────────────────────────────────────
export const IdealWeightFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  frameSize: z.enum(["small", "medium", "large"]),
});

// ─── Lean Body Mass Calculator ────────────────────────────────────────────────
export const LeanBodyMassFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
});

// ─── Macro Calculator ─────────────────────────────────────────────────────────
export const MacroFormSchema = z.object({
  calories: z.coerce
    .number({ error: "Calories must be a number" })
    .positive("Calories must be positive")
    .max(10000, "Calories exceed maximum (10000 kcal)"),
  goal: z.enum(["maintenance", "cutting", "bulking", "keto", "highProtein"]),
});

// ─── One Rep Max Calculator ───────────────────────────────────────────────────
export const OneRepMaxFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  reps: z.coerce
    .number({ error: "Reps must be a number" })
    .int("Reps must be a whole number")
    .min(1, "Reps must be at least 1")
    .max(30, "Reps must be 30 or less"),
});

// ─── Ovulation Calculator ─────────────────────────────────────────────────────
export const OvulationFormSchema = z.object({
  lastPeriodDate: z.string().min(1, "Last period date is required"),
  cycleLength: z.coerce
    .number({ error: "Cycle length must be a number" })
    .int("Cycle length must be a whole number")
    .min(21, "Cycle length must be at least 21 days")
    .max(40, "Cycle length must be 40 days or less"),
});

// ─── Pace Calculator ──────────────────────────────────────────────────────────
export const PaceFormSchema = z.object({
  mode: z.enum(["pace", "time", "distance"]),
  distance: z.coerce
    .number({ error: "Distance must be a number" })
    .positive("Distance must be positive")
    .max(10000, "Distance exceeds maximum (10000 km)"),
  hours: z.coerce
    .number({ error: "Hours must be a number" })
    .int("Hours must be a whole number")
    .min(0, "Hours cannot be negative")
    .max(999, "Hours exceeds maximum (999)"),
  minutes: z.coerce
    .number({ error: "Minutes must be a number" })
    .int("Minutes must be a whole number")
    .min(0, "Minutes cannot be negative")
    .max(59, "Minutes must be 59 or less"),
  seconds: z.coerce
    .number({ error: "Seconds must be a number" })
    .int("Seconds must be a whole number")
    .min(0, "Seconds cannot be negative")
    .max(59, "Seconds must be 59 or less"),
  paceMinutes: z.coerce
    .number({ error: "Pace minutes must be a number" })
    .int("Pace minutes must be a whole number")
    .min(0, "Pace minutes cannot be negative")
    .max(59, "Pace minutes must be 59 or less"),
  paceSeconds: z.coerce
    .number({ error: "Pace seconds must be a number" })
    .int("Pace seconds must be a whole number")
    .min(0, "Pace seconds cannot be negative")
    .max(59, "Pace seconds must be 59 or less"),
});

// ─── Period Calculator ────────────────────────────────────────────────────────
export const PeriodFormSchema = z.object({
  lastPeriodDate: z.string().min(1, "Last period date is required"),
  cycleLength: z.coerce
    .number({ error: "Cycle length must be a number" })
    .int("Cycle length must be a whole number")
    .min(21, "Cycle length must be at least 21 days")
    .max(40, "Cycle length must be 40 days or less"),
  periodLength: z.coerce
    .number({ error: "Period length must be a number" })
    .int("Period length must be a whole number")
    .min(2, "Period length must be at least 2 days")
    .max(10, "Period length must be 10 days or less"),
});

// ─── Pregnancy Weight Gain Calculator ────────────────────────────────────────
export const PregnancyWeightGainFormSchema = z.object({
  prePregnancyWeight: z.coerce
    .number({ error: "Pre-pregnancy weight must be a number" })
    .positive("Pre-pregnancy weight must be positive")
    .max(500, "Pre-pregnancy weight exceeds maximum (500 kg)"),
  currentWeight: z.coerce
    .number({ error: "Current weight must be a number" })
    .positive("Current weight must be positive")
    .max(500, "Current weight exceeds maximum (500 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  weeksPregnant: z.coerce
    .number({ error: "Weeks pregnant must be a number" })
    .int("Weeks pregnant must be a whole number")
    .min(0, "Weeks pregnant cannot be negative")
    .max(42, "Weeks pregnant must be 42 or less"),
  twins: z.boolean(),
});

// ─── Protein Calculator ───────────────────────────────────────────────────────
export const ProteinFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  goal: z.enum(["sedentary", "maintenance", "muscleGain", "fatLoss", "athlete", "endurance"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
});

// ─── Sleep Calculator ─────────────────────────────────────────────────────────
export const SleepFormSchema = z.object({
  mode: z.enum(["wakeTime", "bedTime"]),
  targetTime: z.string().min(1, "Target time is required"),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(130, "Age exceeds maximum (130)"),
});

// ─── Target Heart Rate Calculator ─────────────────────────────────────────────
export const TargetHeartRateFormSchema = z.object({
  age: z.coerce
    .number({ error: "Age must be a number" })
    .positive("Age must be positive")
    .max(130, "Age exceeds maximum (130)"),
  restingHeartRate: z.coerce
    .number({ error: "Resting heart rate must be a number" })
    .min(30, "Resting heart rate must be at least 30 bpm")
    .max(200, "Resting heart rate exceeds maximum (200 bpm)"),
});

// ─── TDEE Calculator ──────────────────────────────────────────────────────────
export const TdeeFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .positive("Age must be positive")
    .max(130, "Age exceeds maximum (130)"),
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  height: z.coerce
    .number({ error: "Height must be a number" })
    .positive("Height must be positive")
    .max(300, "Height exceeds maximum (300 cm)"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
  goal: z.enum(["lose", "maintain", "gain"]),
});

// ─── Water Intake Calculator ──────────────────────────────────────────────────
export const WaterIntakeFormSchema = z.object({
  weight: z.coerce
    .number({ error: "Weight must be a number" })
    .positive("Weight must be positive")
    .max(1000, "Weight exceeds maximum (1000 kg)"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "athlete"]),
  climate: z.enum(["temperate", "hot", "humid", "cold"]),
  pregnant: z.boolean(),
  breastfeeding: z.boolean(),
});
