# Calculator Reference

Complete documentation for all calculators in Converty.

## Table of Contents

- [Photography](#photography)
- [Video Production](#video-production)
- [Web Development](#web-development)
- [Data](#data)
- [Health](#health)
- [Physics](#physics)
- [Music](#music)
- [Color](#color)

---

## Photography

### Depth of Field Calculator

**Route:** `/photo/depth-of-field`

Calculate depth of field from aperture, focal length, and subject distance.

**Formulas:**

```
Hyperfocal: H = f² / (N × c) + f
Near limit: Dn = (H × s) / (H + (s - f))
Far limit:  Df = (H × s) / (H - (s - f))
Total DoF:  DoF = Df - Dn
```

Where: f = focal length, N = f-number, c = circle of confusion, s = subject distance

---

### Advanced DoF Calculator

**Route:** `/photo/advanced-dof`

Depth of field with adjustable Circle of Confusion based on:

- Print size
- Viewing distance
- Visual acuity (cycles per degree)

**CoC Formula:**

```
CoC = (viewing_distance × print_diagonal) / (visual_acuity × diagonal_factor × magnification)
```

---

### Macro DoF Calculator

**Route:** `/photo/macro-dof`

Accurate depth of field for macro photography using magnification ratio.

**Formula:**

```
DoF = 2 × N × c × (m + 1) / m²
```

Where: N = f-number, c = CoC, m = magnification ratio

**Focus Stacking:** Calculates number of shots needed to cover a depth range with desired overlap.

---

### DoF Table

**Route:** `/photo/dof-table`

Interactive table showing depth of field across different apertures and subject distances for a given focal length and sensor.

---

### Hyperfocal Distance Calculator

**Route:** `/photo/hyperfocal`

Calculate the focus distance that maximizes depth of field from the nearest acceptable sharpness to infinity.

**Formula:**

```
H = f² / (N × c) + f
```

When focused at H, everything from H/2 to infinity is acceptably sharp.

---

### Circle of Confusion Calculator

**Route:** `/photo/circle-of-confusion`

Calculate the appropriate CoC value based on:

- Sensor size
- Expected print size
- Viewing distance
- Visual acuity

Standard CoC values by sensor:
| Sensor | CoC (mm) |
|--------|----------|
| Full Frame | 0.030 |
| APS-C (Canon) | 0.019 |
| APS-C (Nikon/Sony) | 0.020 |
| Micro 4/3 | 0.015 |
| 1 inch | 0.011 |

---

### Diffraction Calculator

**Route:** `/photo/diffraction`

Determine when your camera becomes diffraction-limited.

**Airy Disk Formula:**

```
Airy Disk Diameter = 2.44 × λ × N
```

Where: λ = wavelength (typically 550nm for green), N = f-number

**Diffraction Limited:** When Airy disk > pixel pitch

---

### Macro Diffraction Calculator

**Route:** `/photo/macro-diffraction`

Calculate effective aperture and diffraction effects in macro photography.

**Effective Aperture:**

```
N_effective = N × (1 + m)
```

**Light Loss:**

```
Stops lost = 2 × log₂(1 + m)
```

At 1:1 magnification, f/8 becomes effectively f/16 with 2 stops light loss.

---

### Light EV Calculator

**Route:** `/photo/light-ev`

Calculate Exposure Value from camera settings.

**Formula:**

```
EV = log₂(N² / t)
EV₁₀₀ = EV + log₂(ISO / 100)
```

Where: N = f-number, t = shutter speed in seconds

---

### ND Filter Calculator

**Route:** `/photo/nd-filter`

Calculate exposure time when using neutral density filters.

**Formula:**

```
New exposure = Base exposure × 2^(ND stops)
```

| ND Factor | Stops | Filter      |
| --------- | ----- | ----------- |
| ND2       | 1     |             |
| ND4       | 2     |             |
| ND8       | 3     |             |
| ND64      | 6     |             |
| ND1000    | 10    | Big Stopper |

---

### Golden Hour Guide

**Route:** `/photo/golden-hour`

Calculate golden hour and twilight times based on location using the Browser Geolocation API.

**Sun Position Calculations:** Based on NOAA Solar Calculator algorithms.

**Light Phases:**
| Phase | Sun Altitude |
|-------|--------------|
| Golden Hour | 0° to 6° |
| Blue Hour | -4° to 0° |
| Civil Twilight | -6° to 0° |
| Nautical Twilight | -12° to -6° |
| Astronomical Twilight | -18° to -12° |

---

### Spot Stars Calculator (NPF Rule)

**Route:** `/photo/spot-stars`

Calculate maximum exposure time to prevent star trailing.

**NPF Rule:**

```
t = (35 × N + 30 × p) / (f × cos(δ))
```

Where: N = f-number, p = pixel pitch (µm), f = focal length (mm), δ = declination

Simplified **500 Rule:** t = 500 / f

---

### Star Trails Calculator

**Route:** `/photo/star-trails`

Calculate exposure time needed for desired star trail rotation.

**Formula:**

```
Trail length = (exposure_time / 86164) × 360° × cos(declination)
```

Earth rotates 360° in 23h 56m 4s (sidereal day = 86164 seconds).

---

### Aspect Ratio Calculator

**Route:** `/photo/aspect-ratio`

Calculate and convert between aspect ratios.

Common ratios: 1:1, 4:3, 3:2, 16:9, 21:9, 2.39:1

---

### Aspect Fit Calculator

**Route:** `/photo/aspect-fit`

Calculate how an image fits on a screen with letterboxing or pillarboxing.

---

### Composition Calculator

**Route:** `/photo/composition`

Calculate field of view from focal length and subject distance.

**Horizontal FoV:**

```
FoV = 2 × arctan(sensor_width / (2 × focal_length))
```

---

### Portrait Distance Calculator

**Route:** `/photo/portrait-distance`

Calculate ideal shooting distance for portraits based on framing and focal length.

---

### Focal Length Equivalent

**Route:** `/photo/focal-equivalent`

Match settings between different sensor sizes using crop factors.

**Equivalent Focal Length:**

```
Equivalent = Actual × Crop Factor
```

| Sensor             | Crop Factor |
| ------------------ | ----------- |
| Full Frame         | 1.0×        |
| APS-C (Canon)      | 1.6×        |
| APS-C (Nikon/Sony) | 1.5×        |
| Micro 4/3          | 2.0×        |

---

### Megapixel Calculator

**Route:** `/photo/megapixels`

Calculate megapixels from width × height in pixels.

```
MP = (width × height) / 1,000,000
```

---

### Megapixel Aspects

**Route:** `/photo/megapixel-aspects`

View megapixel count in different aspect ratios.

---

### DPI Calculator

**Route:** `/photo/dpi`

Calculate megapixels needed for a given print size and DPI.

**Formula:**

```
MP needed = (print_width × DPI) × (print_height × DPI) / 1,000,000
```

Standard print DPIs: 300 (high quality), 240 (good), 150 (acceptable)

---

### Image Filesize Calculator

**Route:** `/photo/image-filesize`

Estimate file sizes for different image formats.

---

### Time Lapse Calculator

**Route:** `/photo/time-lapse`

Calculate interval, clip length, and memory requirements for time lapse photography.

---

## Video Production

### Video File Size Calculator

**Route:** `/video/video-file-size`

Estimate video file size from resolution, duration, and codec.

**Formula:**

```
Size (MB) = (bitrate_Mbps × duration_seconds) / 8
```

---

### Video Bitrate Calculator

**Route:** `/video/video-bitrate`

Estimate appropriate bitrate based on resolution and codec.

---

### Audio Filesize Calculator

**Route:** `/video/audio-filesize`

Estimate audio file sizes for different formats and bitrates.

---

### Common Bitrates Reference

**Route:** `/video/common-bitrates`

Reference guide for ProRes, DNxHD, DCP, and MPEG bitrates.

---

### DCP File Size Calculator

**Route:** `/video/dcp-filesize`

Calculate Digital Cinema Package file sizes.

---

### Foot-Lambert Calculator

**Route:** `/video/foot-lambert`

Calculate screen luminance for cinema projection.

**Conversion:**

```
1 fL = 3.426 cd/m² (nits)
```

---

### Screen Size Calculator

**Route:** `/video/screen-size`

Calculate screen dimensions from diagonal and aspect ratio.

---

### Frame Rate Converter

**Route:** `/video/frame-rate`

Convert between frame rates with ffmpeg commands.

---

## Web Development

### URL Encoder

**Route:** `/web/url-encoder`

Encode and decode URLs and special characters using percent encoding.

---

### HTML Encoder

**Route:** `/web/html-encoder`

Encode and decode HTML entities.

---

### HTML Character Map

**Route:** `/web/html-chars`

Browse and copy HTML character entities.

---

### Emoji Character Map

**Route:** `/web/emoji-chars`

Browse and copy emoji with HTML codes.

---

### CSP Generator

**Route:** `/web/csp`

Generate Content Security Policy headers.

---

### Redirect Checker

**Route:** `/web/redirect-check`

Check HTTP redirect chains and status codes.

---

### SPF Record Checker

**Route:** `/web/spf-check`

Analyze SPF records for email authentication.

---

### HTTPS Security Checker

**Route:** `/web/https-check`

Check security headers and TLS configuration.

---

### SEO Performance Analyzer

**Route:** `/web/seo-performance`

Analyze page SEO metrics and get recommendations.

---

## Data

### Data Size Calculator

**Route:** `/data/data-size`

Convert between bytes, KB, MB, GB, TB using binary (1024) or decimal (1000) base.

---

### Bandwidth Converter

**Route:** `/data/bandwidth`

Convert Mbps to KB/s, GB/day, TB/week and more.

---

### Download Calculator

**Route:** `/data/download-calculator`

Calculate download time from bandwidth and file size.

---

## Health

### BMI Calculator

**Route:** `/health/bmi`

Calculate Body Mass Index.

**Formula:**

```
BMI = weight (kg) / height² (m²)
```

| BMI         | Category    |
| ----------- | ----------- |
| < 18.5      | Underweight |
| 18.5 - 24.9 | Normal      |
| 25 - 29.9   | Overweight  |
| ≥ 30        | Obese       |

---

### Corpulence Calculator

**Route:** `/health/corpulence`

Calculate Corpulence Index (Ponderal Index).

**Formula:**

```
CI = weight (kg) / height³ (m³)
```

---

## Physics

### Speed Converter

**Route:** `/physics/speed`

Convert between m/s, km/h, mph, knots, and more.

---

## Music

### BPM Calculator

**Route:** `/music/bpm`

Convert BPM to Hz, bar length, and note durations.

**Formulas:**

```
Beat duration (ms) = 60000 / BPM
Bar duration (4/4) = Beat duration × 4
Hz = BPM / 60
```

---

## Color

### RGB Converter

**Route:** `/color/rgb`

Convert between RGB, HEX, HSL, and CMYK color formats.

**Conversions:**

- RGB ↔ HEX
- RGB ↔ HSL
- RGB ↔ CMYK
