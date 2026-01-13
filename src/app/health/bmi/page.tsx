import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { BMICalculator } from "./bmi-calculator";

export const metadata: Metadata = {
  title: "BMI Calculator - Body Mass Index",
  description:
    "Free online BMI calculator. Calculate your Body Mass Index, determine your weight category, and find your healthy weight range.",
  keywords: [
    "bmi calculator",
    "body mass index",
    "weight calculator",
    "health calculator",
    "bmi chart",
  ],
};

export default function BMIPage() {
  const category = getCategoryBySlug("health")!;

  return (
    <ConverterLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) and determine your weight category."
      category={category}
      infoContent={<BMIInfo />}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <BMICalculator />
      </Suspense>
    </ConverterLayout>
  );
}

function BMIInfo() {
  return (
    <div className="space-y-4">
      <p>
        Body Mass Index (BMI) is a person&apos;s weight in kilograms divided by the square of height
        in meters. BMI is an inexpensive and easy screening method for weight categories that may
        lead to health problems.
      </p>

      <h3 className="font-semibold">BMI Categories</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Underweight:</strong> BMI less than 18.5
        </li>
        <li>
          <strong>Normal weight:</strong> BMI 18.5 to 24.9
        </li>
        <li>
          <strong>Overweight:</strong> BMI 25 to 29.9
        </li>
        <li>
          <strong>Obesity Class I:</strong> BMI 30 to 34.9
        </li>
        <li>
          <strong>Obesity Class II:</strong> BMI 35 to 39.9
        </li>
        <li>
          <strong>Obesity Class III:</strong> BMI 40 or higher
        </li>
      </ul>

      <h3 className="font-semibold">Formula</h3>
      <p className="font-mono bg-muted p-2 rounded">BMI = weight (kg) / height (m)²</p>

      <h3 className="font-semibold">Limitations</h3>
      <p>
        BMI is a useful measure for most adults, but it has limitations. It may overestimate body
        fat in athletes and others with muscular builds, and underestimate body fat in older persons
        and others who have lost muscle.
      </p>
    </div>
  );
}
