export interface RoiInput {
  initialInvestment: number;
  finalValue: number;
  years?: number;
}

export interface RoiResult {
  roi: number;
  roiPercent: number;
  profit: number;
  annualizedRoi?: number;
  annualizedRoiPercent?: number;
}

export function calculateRoi(input: RoiInput): RoiResult | null {
  const { initialInvestment, finalValue, years } = input;

  if (initialInvestment <= 0 || finalValue < 0) {
    return null;
  }

  const profit = finalValue - initialInvestment;
  const roi = profit / initialInvestment;
  const roiPercent = roi * 100;

  let annualizedRoi: number | undefined;
  let annualizedRoiPercent: number | undefined;

  if (years && years > 0) {
    annualizedRoi = (finalValue / initialInvestment) ** (1 / years) - 1;
    annualizedRoiPercent = annualizedRoi * 100;
  }

  return {
    roi: Math.round(roi * 10000) / 10000,
    roiPercent: Math.round(roiPercent * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    annualizedRoi: annualizedRoi ? Math.round(annualizedRoi * 10000) / 10000 : undefined,
    annualizedRoiPercent: annualizedRoiPercent
      ? Math.round(annualizedRoiPercent * 100) / 100
      : undefined,
  };
}
