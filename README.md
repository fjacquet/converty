# Converty

A comprehensive unit converter and calculator toolkit built with Next.js 16. Inspired by [toolstud.io](https://toolstud.io), Converty provides 156+ calculators across 12 categories for photography, video production, web development, networking, finance, and more.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **156+ Calculators** across 12 categories
- **Global Search** with Cmd+K / Ctrl+K fuzzy search
- **Progressive Web App** with offline support and install prompt
- **Internationalization** supporting EN, FR, DE, IT locales
- **Dark/Light Mode** with system preference detection
- **Responsive Design** works on desktop and mobile
- **Shareable Links** with URL state persistence
- **No Backend Required** - all calculations run client-side
- **Browser Geolocation** for location-based calculations
- **Static Export** for easy deployment anywhere

## Categories

| Category     | Calculators | Description                                                       |
| ------------ | ----------- | ----------------------------------------------------------------- |
| **Math**     | 38          | Algebra, geometry, statistics, trigonometry, number theory        |
| **Finance**  | 24          | Mortgage, compound interest, ROI, tax, currency, savings          |
| **Health**   | 28          | BMI, BMR, body fat, calories, hydration, heart rate               |
| **Photo**    | 22          | DoF, hyperfocal, exposure, aspect ratio, diffraction, golden hour |
| **Web**      | 10          | URL/HTML encoding, CSP generator, SEO analyzer, security checks   |
| **Video**    | 9           | File size, bitrate, frame rate, screen size, DCP, time-lapse      |
| **DateTime** | 8           | Age, duration, timezone, countdown, date difference               |
| **Network**  | 5           | Subnet calculator, IP address, CIDR range, network speed          |
| **Data**     | 3           | Data size, bandwidth, download time                               |
| **Physics**  | 1           | Speed conversion                                                  |
| **Music**    | 1           | BPM calculator                                                    |
| **Color**    | 1           | RGB/HEX/HSL converter                                             |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/fjacquet/converty.git
cd converty

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build optimized production version
npm run build

# Start production server
npm start
```

### Static Export

```bash
# Generate static HTML export
npm run build
# Output is in the 'out' directory
```

## Project Structure

```text
converty/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── photo/              # Photography calculators
│   │   ├── video/              # Video production tools
│   │   ├── web/                # Web development utilities
│   │   └── ...                 # Other categories
│   ├── components/
│   │   ├── converter/          # Reusable calculator components
│   │   ├── layout/             # Header, theme toggle
│   │   └── ui/                 # Base UI components
│   ├── lib/
│   │   ├── converters/         # Pure calculation functions
│   │   │   ├── photo/          # Photo calculation logic
│   │   │   ├── video/          # Video calculation logic
│   │   │   └── ...
│   │   └── registry/           # Converter metadata registry
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── docs/                       # Documentation
```

## Available Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start development server with Turbopack |
| `npm run build`      | Build for production                    |
| `npm run start`      | Start production server                 |
| `npm run type-check` | Run TypeScript compiler check           |
| `npm run format`     | Format code with Biome                  |
| `npm run lint`       | Lint code with Biome                    |

## Photography Calculators

### Depth of Field Family

- **Depth of Field** - Basic DoF from aperture, focal length, distance
- **Advanced DoF** - DoF with adjustable CoC for print size/viewing distance
- **Macro DoF** - Accurate DoF using magnification ratio
- **DoF Table** - Interactive table across apertures and distances
- **Hyperfocal Distance** - Calculate focus distance for maximum DoF
- **Circle of Confusion** - CoC from sensor, print size, viewing distance

### Diffraction Calculators

- **Diffraction** - Detect when camera becomes diffraction-limited
- **Macro Diffraction** - Effective aperture and diffraction in macro

### Exposure & Light

- **Light EV** - Calculate Exposure Value from settings
- **ND Filter** - Exposure time with neutral density filters
- **Golden Hour** - Sun times based on geolocation (with Browser Geolocation API)

### Astrophotography

- **Spot Stars** - Max exposure to prevent star trailing (NPF Rule)
- **Star Trails** - Exposure time for star trail rotation

### Composition & Framing

- **Aspect Ratio** - Calculate and convert aspect ratios
- **Aspect Fit** - Fit images with letterboxing/pillarboxing
- **Composition** - Field of view from focal length
- **Portrait Distance** - Ideal shooting distance for portraits
- **Focal Equivalent** - Match settings between sensor sizes

### Resolution & Print

- **Megapixels** - Calculate from width × height
- **Megapixel Aspects** - View MP in different aspect ratios
- **DPI Calculator** - Megapixels needed for print size
- **Image Filesize** - Estimate JPEG/PNG/RAW file sizes
- **Time Lapse** - Interval, clip length, memory calculator

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.0
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [Biome](https://biomejs.dev/) 2.3
- **Build**: Turbopack (development)

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fjacquet/converty)

### Docker

```bash
# Build Docker image
docker build -t converty .

# Run container
docker run -p 3000:3000 converty
```

### Static Hosting (GitHub Pages, Netlify, etc.)

The project exports as static HTML. After building, deploy the `out` directory to any static hosting provider.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding a New Calculator

1. Create calculation logic in `src/lib/converters/{category}/{name}.ts`
2. Create page in `src/app/{category}/{name}/page.tsx`
3. Create component in `src/app/{category}/{name}/{name}-calculator.tsx`
4. Register in `src/lib/registry/converters.ts`
5. Export from `src/lib/converters/{category}/index.ts`

## Roadmap

### Shipped in v2.0

- [x] Network calculators (subnet calculator, IP address, CIDR range, network speed)
- [x] Global search (Cmd+K) with fuzzy matching
- [x] 100% internationalization (EN, FR, DE, IT)
- [x] PWA support for offline use
- [x] Shareable calculation links with URL state

### Planned for v3.0

- [ ] Calculator expansion (100+ new calculators)
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Favorites and calculation history
- [ ] Export results to PDF/CSV

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [toolstud.io](https://toolstud.io)
- Solar calculations based on [NOAA Solar Calculator](https://gml.noaa.gov/grad/solcalc/)
- Photography formulas from [PhotoPills](https://www.photopills.com/)
