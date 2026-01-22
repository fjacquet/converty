# Internationalization Audit: Hardcoded String Inventory

This document provides a comprehensive inventory of all hardcoded, user-facing strings found within the calculator logic of the Converty application. Each entry includes the file path, line number, and the raw English string that requires externalization into the `next-intl` message files.

---

## Files

### `src/lib/converters/health/carb-calculator.ts`

- **Line 113**: `Oats`
- **Line 114**: `Brown rice`
- **Line 115**: `Quinoa`
- **Line 116**: `Sweet potatoes`
- **Line 117**: `Whole grain bread`
- **Line 118**: `Beans and lentils`
- **Line 119**: `Vegetables`
- **Line 120**: `Whole wheat pasta`
- **Line 122**: `Fruits`
- **Line 123**: `Honey (in moderation)`
- **Line 124**: `Milk`
- **Line 125**: `Sports drinks (around workouts)`
- **Line 127**: `White bread`
- **Line 128**: `Sugary cereals`
- **Line 129**: `Candy and sweets`
- **Line 130**: `Soda and sugary drinks`
- **Line 131**: `Pastries and baked goods`
- **Line 132**: `White rice (limit)`

---

### `src/lib/converters/health/corpulence.ts`

- **Line 52**: `Underweight`
- **Line 53**: `Below normal corpulence range`
- **Line 54**: `Increased risk of nutritional deficiencies`
- **Line 58**: `Normal (Lower)`
- **Line 59**: `Lower end of normal corpulence range`
- **Line 60**: `Low health risk`
- **Line 64**: `Normal`
- **Line 65**: `Optimal corpulence range`
- **Line 66**: `Minimal health risk`
- **Line 70**: `Normal (Upper)`
- **Line 71**: `Upper end of normal corpulence range`
- **Line 72**: `Low health risk`
- **Line 76**: `Overweight`
- **Line 77**: `Above normal corpulence range`
- **Line 78**: `Moderate health risk`
- **Line 82**: `Obese`
- **Line 83**: `Significantly above normal range`
- **Line 84**: `Increased health risk`
- **Line 110**: `BMI and CI indicate similar body composition`
- **Line 112**: `CI suggests relatively more mass for height than BMI indicates`
- **Line 114**: `CI suggests relatively less mass for height than BMI indicates`

---

### `src/lib/converters/health/fat-intake-calculator.ts`

- **Line 92**: `Avocados`
- **Line 93**: `Olive oil`
- **Line 94**: `Nuts (almonds, walnuts, cashews)`
- **Line 95**: `Seeds (chia, flax, pumpkin)`
- **Line 96**: `Fatty fish (salmon, mackerel, sardines)`
- **Line 97**: `Eggs`
- **Line 98**: `Dark chocolate (70%+ cocoa)`
- **Line 99**: `Nut butters`
- **Line 101**: `Butter`
- **Line 102**: `Cheese`
- **Line 103**: `Red meat`
- **Line 104**: `Coconut oil`
- **Line 105**: `Full-fat dairy`
- **Line 106**: `Palm oil`
- **Line 108**: `Trans fats (partially hydrogenated oils)`
- **Line 109**: `Deep-fried foods`
- **Line 110**: `Margarine`
- **Line 111**: `Processed snacks`
- **Line 112**: `Fast food`
- **Line 113**: `Commercially baked goods`

---

### `src/lib/converters/health/gfr-calculator.ts`

- **Line 67**: `Stage 1: Normal or high GFR`
- **Line 68**: `Normal kidney function`
- **Line 69**: `Monitor if you have risk factors for kidney disease`
- **Line 72**: `Stage 2: Mildly decreased GFR`
- **Line 73**: `Mild loss of kidney function`
- **Line 74**: `Lifestyle changes, monitor blood pressure`
- **Line 77**: `Stage 3a: Mild to moderate decrease`
- **Line 78**: `Mild to moderate loss of kidney function`
- **Line 79**: `See a nephrologist, manage complications`
- **Line 82**: `Stage 3b: Moderate to severe decrease`
- **Line 83**: `Moderate to severe loss of kidney function`
- **Line 84**: `See a nephrologist, dietary changes`
- **Line 87**: `Stage 4: Severely decreased GFR`
- **Line 88**: `Severe loss of kidney function`
- **Line 89**: `Prepare for dialysis or transplant`
- **Line 92**: `Stage 5: Kidney failure`
- **Line 93**: `Kidney failure (ESRD)`
- **Line 94**: `Dialysis or kidney transplant needed`

---

### `src/lib/converters/health/healthy-weight-calculator.ts`

- **Line 73**: `Severely Underweight`
- **Line 79**: `Underweight`
- **Line 85**: `Normal (Healthy)`
- **Line 91**: `Overweight`
- **Line 97**: `Obese Class I`
- **Line 103**: `Obese Class II`
- **Line 109**: `Obese Class III`

---

### `src/lib/converters/health/protein-calculator.ts`

- **Line 89**: `Chicken Breast`
- **Line 89**: `100g cooked`
- **Line 90**: `Eggs`
- **Line 90**: `1 large`
- **Line 91**: `Greek Yogurt`
- **Line 91**: `170g`
- **Line 92**: `Salmon`
- **Line 92**: `100g`
- **Line 93**: `Lean Beef`
- **Line 93**: `100g`
- **Line 94**: `Tofu`
- **Line 94**: `100g`
- **Line 95**: `Lentils`
- **Line 95**: `100g cooked`
- **Line 96**: `Whey Protein`
- **Line 96**: `1 scoop (30g)`
- **Line 97**: `Cottage Cheese`
- **Line 97**: `100g`
- **Line 98**: `Tuna`
- **Line 98**: `100g canned`

---

### `src/lib/converters/health/water-intake-calculator.ts`

- **Line 101**: `Drink a glass of water first thing in the morning`
- **Line 102**: `Carry a reusable water bottle with you`
- **Line 103**: `Set reminders on your phone to drink water`
- **Line 104**: `Drink water before, during, and after exercise`
- **Line 105**: `Eat water-rich foods like fruits and vegetables`
- **Line 106**: `Drink a glass of water before each meal`
- **Line 107**: `Monitor your urine color - pale yellow is ideal`

---

### `src/lib/converters/finance/compound-interest.ts`

- **Line 131**: `Annually`
- **Line 132**: `Semi-Annually`
- **Line 133**: `Quarterly`
- **Line 134**: `Monthly`
- **Line 135**: `Daily`

---

### `src/lib/converters/finance/currency.ts`

- **Line 28**: `US Dollar`
- **Line 29**: `Euro`
- **Line 30**: `British Pound`
- **Line 31**: `Swiss Franc`
- **Line 32**: `Japanese Yen`
- **Line 33**: `Canadian Dollar`
- **Line 34**: `Australian Dollar`
- **Line 35**: `Chinese Yuan`
- **Line 36**: `Indian Rupee`
- **Line 37**: `Mexican Peso`
- **Line 38**: `Brazilian Real`
- **Line 39**: `South Korean Won`
- **Line 40**: `Singapore Dollar`
- **Line 41**: `Hong Kong Dollar`
- **Line 42**: `Swedish Krona`
- **Line 43**: `Norwegian Krone`
- **Line 44**: `Danish Krone`
- **Line 45**: `New Zealand Dollar`
- **Line 46**: `South African Rand`
- **Line 47**: `Russian Ruble`

---

### `src/lib/converters/finance/salary.ts`

- **Line 90**: `Alabama`
- **Line 91**: `Alaska`
- **Line 92**: `Arizona`
- **Line 93**: `Arkansas`
- **Line 94**: `California`
- **Line 95**: `Colorado`
- **Line 96**: `Connecticut`
- **Line 97**: `Delaware`
- **Line 98**: `Florida`
- **Line 99**: `Georgia`
- **Line 100**: `Hawaii`
- **Line 101**: `Idaho`
- **Line 102**: `Illinois`
- **Line 103**: `Indiana`
- **Line 104**: `Iowa`
- **Line 105**: `Kansas`
- **Line 106**: `Kentucky`
- **Line 107**: `Louisiana`
- **Line 108**: `Maine`
- **Line 109**: `Maryland`
- **Line 110**: `Massachusetts`
- **Line 111**: `Michigan`
- **Line 112**: `Minnesota`
- **Line 113**: `Mississippi`
- **Line 114**: `Missouri`
- **Line 115**: `Montana`
- **Line 116**: `Nebraska`
- **Line 117**: `Nevada`
- **Line 118**: `New Hampshire`
- **Line 118**: `Dividends/interest only`
- **Line 119**: `New Jersey`
- **Line 120**: `New Mexico`
- **Line 121**: `New York`
- **Line 122**: `North Carolina`
- **Line 123**: `North Dakota`
- **Line 124**: `Ohio`
- **Line 125**: `Oklahoma`
- **Line 126**: `Oregon`
- **Line 127**: `Pennsylvania`
- **Line 128**: `Rhode Island`
- **Line 129**: `South Carolina`
- **Line 130**: `South Dakota`
- **Line 131**: `Tennessee`
- **Line 132**: `Texas`
- **Line 133**: `Utah`
- **Line 134**: `Vermont`
- **Line 135**: `Virginia`
- **Line 136**: `Washington`
- **Line 137**: `West Virginia`
- **Line 138**: `Wisconsin`
- **Line 139**: `Wyoming`
- **Line 140**: `District of Columbia`
- **Line 261**: `Unknown`

---

### `src/lib/converters/datetime/date.ts`

- **Line 17**: `Sunday`
- **Line 17**: `Monday`
- **Line 17**: `Tuesday`
- **Line 17**: `Wednesday`
- **Line 17**: `Thursday`
- **Line 17**: `Friday`
- **Line 17**: `Saturday`

---

### `src/lib/converters/datetime/day-counter.ts`

- **Line 72**: `week`
- **Line 72**: `weeks`
- **Line 73**: `day`
- **Line 73**: `days`
- **Line 74**: `0 days`
- **Line 82**: `and`

---

### `src/lib/converters/datetime/day-of-week.ts`

- **Line 13**: `Sunday`
- **Line 13**: `Monday`
- **Line 13**: `Tuesday`
- **Line 13**: `Wednesday`
- **Line 13**: `Thursday`
- **Line 13**: `Friday`
- **Line 13**: `Saturday`

---

### `src/lib/converters/datetime/duration-converter.ts`

- **Line 66**: `0 seconds`
- **Line 93**: `year`
- **Line 93**: `years`
- **Line 94**: `month`
- **Line 94**: `months`
- **Line 95**: `week`
- **Line 95**: `weeks`
- **Line 96**: `day`
- **Line 96**: `days`
- **Line 97**: `hour`
- **Line 97**: `hours`
- **Line 98**: `minute`
- **Line 98**: `minutes`
- **Line 99**: `second`
- **Line 99**: `seconds`

---

### `src/lib/converters/datetime/time-duration.ts`

- **Line 77**: `year`
- **Line 77**: `years`
- **Line 78**: `month`
- **Line 78**: `months`
- **Line 79**: `day`
- **Line 79**: `days`
- **Line 80**: `hour`
- **Line 80**: `hours`
- **Line 81**: `minute`
- **Line 81**: `minutes`
- **Line 82**: `second`
- **Line 82**: `seconds`

---

### `src/lib/converters/datetime/time-zone.ts`

- **Line 63**: `Other`
- **Line 115**: `Africa`
- **Line 116**: `America`
- **Line 117**: `Antarctica`
- **Line 118**: `Arctic`
- **Line 119**: `Asia`
- **Line 120**: `Atlantic`
- **Line 121**: `Australia`
- **Line 122**: `Europe`
- **Line 123**: `Indian`
- **Line 124**: `Pacific`
- **Line 125**: `Other`

---

### `src/lib/converters/data/data-size.ts`

- **Line 17**: `Bytes`
- **Line 18**: `Kilobytes`
- **Line 19**: `Megabytes`
- **Line 20**: `Gigabytes`
- **Line 21**: `Terabytes`
- **Line 22**: `Petabytes`
- **Line 23**: `Kibibytes`
- **Line 24**: `Mebibytes`
- **Line 25**: `Gibibytes`
- **Line 26**: `Tebibytes`
- **Line 27**: `Pebibytes`
- **Line 70**: `0 B`

---

### `src/lib/converters/data/download-calculator.ts`

- **Line 9**: `Bytes`
- **Line 97**: `3G Mobile`
- **Line 98**: `4G LTE`
- **Line 99**: `5G`
- **Line 100**: `Basic Broadband`
- **Line 101**: `Fast Broadband`
- **Line 102**: `Gigabit Fiber`
- **Line 107**: `MP3 Song`
- **Line 108**: `HD Photo`
- **Line 109**: `HD Movie`
- **Line 110**: `4K Movie`
- **Line 111**: `Game`
- **Line 112**: `OS Image`

---

### `src/app/[locale]/music/bpm/bpm-calculator.tsx`

- **Line 23**: `BPM`
- **Line 28**: `Enter BPM`
- **Line 33**: `Tempo Marking`
- **Line 42**: `Frequency`
- **Line 42**: `Hz`
- **Line 43**: `Beat Duration`
- **Line 43**: `ms`
- **Line 44**: `Beats per Second`
- **Line 44**: `bps`
- **Line 45**: `4/4 Bar Length`
- **Line 45**: `ms`
- **Line 52**: `Note Durations`
- **Line 56**: `Note`
- **Line 57**: `Symbol`
- **Line 58**: `Beats`
- **Line 59**: `Duration (ms)`

---

### `src/app/[locale]/music/page.tsx`

- **Line 55**: `Music calculators coming soon!`

---

### `src/app/[locale]/video/foot-lambert/foot-lambert-calculator.tsx`

- **Line 35**: `Unit`
- **Line 40**: `Foot-Lamberts (fL)`
- **Line 41**: `Nits (cd/m²)`
- **Line 42**: `Lumens`
- **Line 51**: `ft`
- **Line 59**: `ft`
- **Line 70**: `Foot-Lamberts`
- **Line 71**: `Nits`
- **Line 72**: `Lumens`
- **Line 70**: `fL`
- **Line 71**: `cd/m²`
- **Line 72**: `lm`
- **Line 78**: `Brightness Level`
- **Line 84**: `Reference Values`
- **Line 89**: `Standard`
- **Line 90**: `Foot-Lamberts`
- **Line 91**: `Note`
- **Line 100**: `fL`

---

### `src/lib/converters/video/foot-lambert.ts`

- **Line 75**: `Very dim`
- **Line 75**: `Not suitable for most viewing`
- **Line 77**: `Dim`
- **Line 77**: `3D cinema presentation`
- **Line 79**: `Standard 2D Cinema`
- **Line 79**: `DCI standard for 2D (14 fL target)`
- **Line 81**: `Bright cinema`
- **Line 81**: `Premium large format`
- **Line 83**: `Very bright`
- **Line 83**: `HDR cinema, Dolby Cinema`
- **Line 85**: `Home theater`
- **Line 85**: `High-end home projection`
- **Line 87**: `Display brightness`
- **Line 87**: `Direct-view displays, monitors`
- **Line 91**: `DCI 2D Standard`
- **Line 91**: `Industry standard`
- **Line 92**: `DCI 3D Standard`
- **Line 92**: `With 3D glasses`
- **Line 93**: `Dolby Cinema`
- **Line 93**: `Laser projection`
- **Line 94**: `IMAX`
- **Line 94**: `Large format`
- **Line 95**: `Home Theater`
- **Line 95**: `Recommended minimum`
- **Line 96**: `HDR Display`
- **Line 96**: `Peak HDR`

---

### `src/app/[locale]/video/video-bitrate/page.tsx`

- **Line 25**: `bitrate`
- **Line 25**: `video`
- **Line 25**: `resolution`
- **Line 25**: `fps`
- **Line 25**: `codec`
- **Line 25**: `h264`
- **Line 25**: `h265`

---
