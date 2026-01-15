export interface DueDateInput {
  calculationMethod: "lmp" | "conception" | "ultrasound" | "ivf";
  date: string; // ISO date string
  cycleLength?: number; // days, for LMP method
  ultrasoundWeeks?: number;
  ultrasoundDays?: number;
}

export interface DueDateResult {
  dueDate: string;
  conceptionDate: string;
  currentWeeks: number;
  currentDays: number;
  totalDays: number;
  daysRemaining: number;
  trimester: 1 | 2 | 3;
  trimesterProgress: number;
  milestones: Array<{
    week: number;
    name: string;
    date: string;
    passed: boolean;
  }>;
}

export function calculateDueDate(input: DueDateInput): DueDateResult | null {
  const { calculationMethod, date, cycleLength = 28, ultrasoundWeeks = 0, ultrasoundDays = 0 } = input;

  const inputDate = new Date(date);
  if (isNaN(inputDate.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let conceptionDate: Date;
  let dueDate: Date;

  switch (calculationMethod) {
    case "lmp": {
      // Naegele's rule: LMP + 280 days (adjusted for cycle length)
      const cycleAdjustment = cycleLength - 28;
      conceptionDate = new Date(inputDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14 + cycleAdjustment);
      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + 280 + cycleAdjustment);
      break;
    }
    case "conception": {
      conceptionDate = new Date(inputDate);
      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + 266); // 38 weeks from conception
      break;
    }
    case "ultrasound": {
      // Calculate backwards from ultrasound gestational age
      const gestationalDays = ultrasoundWeeks * 7 + ultrasoundDays;
      conceptionDate = new Date(inputDate);
      conceptionDate.setDate(conceptionDate.getDate() - gestationalDays + 14);
      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + (280 - gestationalDays));
      break;
    }
    case "ivf": {
      // IVF transfer date + 266 days (for day 0 embryo) or adjusted
      conceptionDate = new Date(inputDate);
      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + 266);
      break;
    }
    default:
      return null;
  }

  // Calculate current gestational age
  const lmpDate = new Date(conceptionDate);
  lmpDate.setDate(lmpDate.getDate() - 14); // LMP is 14 days before conception

  const daysSinceLmp = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(0, daysSinceLmp);
  const currentWeeks = Math.floor(totalDays / 7);
  const currentDays = totalDays % 7;

  const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Determine trimester
  let trimester: 1 | 2 | 3;
  let trimesterProgress: number;
  if (currentWeeks < 13) {
    trimester = 1;
    trimesterProgress = (currentWeeks / 13) * 100;
  } else if (currentWeeks < 27) {
    trimester = 2;
    trimesterProgress = ((currentWeeks - 13) / 14) * 100;
  } else {
    trimester = 3;
    trimesterProgress = ((currentWeeks - 27) / 13) * 100;
  }

  // Key milestones
  const milestonesData = [
    { week: 4, name: "Implantation complete" },
    { week: 6, name: "Heartbeat detectable" },
    { week: 8, name: "All major organs forming" },
    { week: 12, name: "End of first trimester" },
    { week: 16, name: "Gender may be visible" },
    { week: 20, name: "Anatomy scan / Halfway point" },
    { week: 24, name: "Viability milestone" },
    { week: 28, name: "Third trimester begins" },
    { week: 32, name: "Baby's lungs developing" },
    { week: 37, name: "Full term" },
    { week: 40, name: "Due date" },
  ];

  const milestones = milestonesData.map(({ week, name }) => {
    const milestoneDate = new Date(lmpDate);
    milestoneDate.setDate(milestoneDate.getDate() + week * 7);
    return {
      week,
      name,
      date: milestoneDate.toISOString().split("T")[0],
      passed: currentWeeks >= week,
    };
  });

  return {
    dueDate: dueDate.toISOString().split("T")[0],
    conceptionDate: conceptionDate.toISOString().split("T")[0],
    currentWeeks,
    currentDays,
    totalDays,
    daysRemaining,
    trimester,
    trimesterProgress: Math.min(100, trimesterProgress),
    milestones,
  };
}
