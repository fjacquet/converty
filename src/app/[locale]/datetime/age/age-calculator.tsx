"use client";

import { useMemo } from "react";
import { InputField, PdfExportButton, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type AgeInput, type AgeResult, calculateAge } from "@/lib/converters/datetime/age";
import { createCalculatorStore } from "@/stores/calculator-store";

const useAgeStore = createCalculatorStore<AgeInput, AgeResult>({
  name: "age-calculator",
  initialValues: { birthDate: "" },
  calculate: calculateAge,
});

export function AgeCalculator() {
  const { values, setValue, result } = useAgeStore();

  const pdfSections = useMemo(() => {
    if (!result) return [];
    return [
      {
        title: "Age",
        items: [
          { label: "Years", value: result.years },
          { label: "Months", value: result.months },
          { label: "Days", value: result.days },
        ],
      },
      {
        title: "Totals",
        items: [
          { label: "Total Days", value: result.totalDays.toLocaleString() },
          { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
          { label: "Total Months", value: result.totalMonths },
        ],
      },
      {
        title: "Additional Info",
        items: [
          { label: "Zodiac Sign", value: result.zodiacSign },
          { label: "Chinese Zodiac", value: result.chineseZodiac },
          { label: "Days Until Birthday", value: result.nextBirthday.daysUntil },
        ],
      },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enter Birth Date</CardTitle>
        </CardHeader>
        <CardContent>
          <InputField
            id="birthDate"
            label="Birth Date"
            type="date"
            value={values.birthDate}
            onChange={(value) => setValue("birthDate", value)}
          />
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Your Age</CardTitle>
              <PdfExportButton
                sections={pdfSections}
                options={{
                  title: "Age Calculator Results",
                  subtitle: `Birth Date: ${values.birthDate}`,
                }}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-3xl font-bold text-primary">
                  {result.years} years, {result.months} months, {result.days} days
                </p>
              </div>

              <ResultGrid
                results={[
                  { label: "Total Days", value: result.totalDays.toLocaleString() },
                  { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
                  { label: "Total Months", value: result.totalMonths },
                ]}
                columns={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "Zodiac Sign", value: result.zodiacSign },
                  { label: "Chinese Zodiac", value: result.chineseZodiac },
                  { label: "Next Birthday", value: result.nextBirthday.date.toLocaleDateString() },
                  { label: "Days Until Birthday", value: result.nextBirthday.daysUntil },
                ]}
                columns={2}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
