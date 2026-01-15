"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type BondResult, calculateBond } from "@/lib/converters/finance/bond-calculator";

export function BondCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [faceValue, setFaceValue] = useState<number>(1000);
  const [couponRate, setCouponRate] = useState<number>(5);
  const [yearsToMaturity, setYearsToMaturity] = useState<number>(10);
  const [paymentFrequency, setPaymentFrequency] = useState<number>(2);
  const [marketRate, setMarketRate] = useState<number>(4);

  const result: BondResult | null = calculateBond({
    faceValue,
    couponRate,
    yearsToMaturity,
    paymentFrequency,
    marketRate,
  });

  const formatCurrency = (value: number) =>
    format.number(value, { style: "currency", currency: "CHF" });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("sections.input")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faceValue">Face Value (Par)</Label>
            <Input
              id="faceValue"
              type="number"
              min="100"
              step="100"
              value={faceValue}
              onChange={(e) => setFaceValue(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="couponRate">Coupon Rate (%)</Label>
            <Input
              id="couponRate"
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={couponRate}
              onChange={(e) => setCouponRate(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Annual interest rate paid by the bond</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsToMaturity">Years to Maturity</Label>
            <Input
              id="yearsToMaturity"
              type="number"
              min="1"
              max="30"
              step="1"
              value={yearsToMaturity}
              onChange={(e) => setYearsToMaturity(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <select
              id="paymentFrequency"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value={1}>Annual</option>
              <option value={2}>Semi-Annual</option>
              <option value={4}>Quarterly</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketRate">Market Interest Rate (%)</Label>
            <Input
              id="marketRate"
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={marketRate}
              onChange={(e) => setMarketRate(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Current market yield for comparable bonds
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("sections.results")}</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Bond Price</p>
                <p className="text-3xl font-bold">{formatCurrency(result.bondPrice)}</p>
                <p
                  className={`text-xs mt-1 ${result.isPremium ? "text-red-600" : "text-green-600"}`}
                >
                  {result.isPremium ? "Premium" : "Discount"}:{" "}
                  {formatCurrency(result.premiumOrDiscount)}
                  {result.isPremium ? " above" : " below"} par
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Yield</p>
                  <p className="text-xl font-bold text-blue-600">
                    {result.currentYield.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Yield to Maturity</p>
                  <p className="text-xl font-bold text-green-600">
                    {result.yieldToMaturity.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Annual Coupon</p>
                  <p className="text-xl font-bold">{formatCurrency(result.couponPayment)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Coupons</p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalCouponPayments)}</p>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(result.totalReturn)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coupon payments + face value - purchase price
                </p>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span>{formatCurrency(result.bondPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Coupons Received</span>
                  <span>{formatCurrency(result.totalCouponPayments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Face Value at Maturity</span>
                  <span>{formatCurrency(faceValue)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span>Total Return</span>
                  <span className="text-green-600">{formatCurrency(result.totalReturn)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Enter valid values to calculate</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
