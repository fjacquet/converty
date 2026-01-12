export interface FileSizeUnit {
  id: string;
  name: string;
  bytes: number;
}

export const FILE_SIZE_UNITS: FileSizeUnit[] = [
  { id: "B", name: "Bytes", bytes: 1 },
  { id: "KB", name: "KB", bytes: 1024 },
  { id: "MB", name: "MB", bytes: 1024 * 1024 },
  { id: "GB", name: "GB", bytes: 1024 * 1024 * 1024 },
  { id: "TB", name: "TB", bytes: 1024 * 1024 * 1024 * 1024 },
];

export interface BandwidthSpeedUnit {
  id: string;
  name: string;
  bitsPerSecond: number;
}

export const SPEED_UNITS: BandwidthSpeedUnit[] = [
  { id: "kbps", name: "Kbps", bitsPerSecond: 1000 },
  { id: "mbps", name: "Mbps", bitsPerSecond: 1000000 },
  { id: "gbps", name: "Gbps", bitsPerSecond: 1000000000 },
  { id: "KBps", name: "KB/s", bitsPerSecond: 8000 },
  { id: "MBps", name: "MB/s", bitsPerSecond: 8000000 },
];

export interface DownloadTimeResult {
  totalSeconds: number;
  formatted: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateDownloadTime(
  fileSize: number,
  fileSizeUnit: string,
  bandwidth: number,
  bandwidthUnit: string
): DownloadTimeResult | null {
  if (fileSize <= 0 || bandwidth <= 0) return null;

  const sizeUnit = FILE_SIZE_UNITS.find((u) => u.id === fileSizeUnit);
  const speedUnit = SPEED_UNITS.find((u) => u.id === bandwidthUnit);

  if (!sizeUnit || !speedUnit) return null;

  const totalBytes = fileSize * sizeUnit.bytes;
  const totalBits = totalBytes * 8;
  const bitsPerSecond = bandwidth * speedUnit.bitsPerSecond;

  const totalSeconds = totalBits / bitsPerSecond;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formatted = "";
  if (days > 0) formatted += `${days}d `;
  if (hours > 0 || days > 0) formatted += `${hours}h `;
  if (minutes > 0 || hours > 0 || days > 0) formatted += `${minutes}m `;
  formatted += `${seconds}s`;

  return {
    totalSeconds,
    formatted: formatted.trim(),
    days,
    hours,
    minutes,
    seconds,
  };
}

// Common bandwidth presets
export const BANDWIDTH_PRESETS = [
  { name: "3G Mobile", speed: 3, unit: "mbps" },
  { name: "4G LTE", speed: 25, unit: "mbps" },
  { name: "5G", speed: 100, unit: "mbps" },
  { name: "Basic Broadband", speed: 25, unit: "mbps" },
  { name: "Fast Broadband", speed: 100, unit: "mbps" },
  { name: "Gigabit Fiber", speed: 1, unit: "gbps" },
];

// Common file size presets
export const FILE_SIZE_PRESETS = [
  { name: "MP3 Song", size: 5, unit: "MB" },
  { name: "HD Photo", size: 10, unit: "MB" },
  { name: "HD Movie", size: 4, unit: "GB" },
  { name: "4K Movie", size: 20, unit: "GB" },
  { name: "Game", size: 50, unit: "GB" },
  { name: "OS Image", size: 5, unit: "GB" },
];
