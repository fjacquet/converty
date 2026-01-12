export type DataUnit =
  | "b"
  | "kb"
  | "mb"
  | "gb"
  | "tb"
  | "pb"
  | "kib"
  | "mib"
  | "gib"
  | "tib"
  | "pib";

export interface DataUnitInfo {
  id: DataUnit;
  name: string;
  symbol: string;
  bytes: number;
  binary: boolean;
}

export const DATA_UNITS: DataUnitInfo[] = [
  { id: "b", name: "Bytes", symbol: "B", bytes: 1, binary: false },
  { id: "kb", name: "Kilobytes", symbol: "KB", bytes: 1000, binary: false },
  { id: "mb", name: "Megabytes", symbol: "MB", bytes: 1000 ** 2, binary: false },
  { id: "gb", name: "Gigabytes", symbol: "GB", bytes: 1000 ** 3, binary: false },
  { id: "tb", name: "Terabytes", symbol: "TB", bytes: 1000 ** 4, binary: false },
  { id: "pb", name: "Petabytes", symbol: "PB", bytes: 1000 ** 5, binary: false },
  { id: "kib", name: "Kibibytes", symbol: "KiB", bytes: 1024, binary: true },
  { id: "mib", name: "Mebibytes", symbol: "MiB", bytes: 1024 ** 2, binary: true },
  { id: "gib", name: "Gibibytes", symbol: "GiB", bytes: 1024 ** 3, binary: true },
  { id: "tib", name: "Tebibytes", symbol: "TiB", bytes: 1024 ** 4, binary: true },
  { id: "pib", name: "Pebibytes", symbol: "PiB", bytes: 1024 ** 5, binary: true },
];

export function getUnitInfo(unit: DataUnit): DataUnitInfo | undefined {
  return DATA_UNITS.find((u) => u.id === unit);
}

export function convertDataSize(
  value: number,
  fromUnit: DataUnit,
  toUnit: DataUnit
): number {
  const from = getUnitInfo(fromUnit);
  const to = getUnitInfo(toUnit);

  if (!from || !to) return 0;

  const bytes = value * from.bytes;
  return bytes / to.bytes;
}

export interface DataSizeConversion {
  bytes: number;
  kb: number;
  mb: number;
  gb: number;
  tb: number;
  kib: number;
  mib: number;
  gib: number;
  tib: number;
}

export function convertToAll(value: number, fromUnit: DataUnit): DataSizeConversion {
  const bytes = convertDataSize(value, fromUnit, "b");

  return {
    bytes,
    kb: bytes / 1000,
    mb: bytes / 1000 ** 2,
    gb: bytes / 1000 ** 3,
    tb: bytes / 1000 ** 4,
    kib: bytes / 1024,
    mib: bytes / 1024 ** 2,
    gib: bytes / 1024 ** 3,
    tib: bytes / 1024 ** 4,
  };
}

export function formatDataSize(bytes: number, binary = false): string {
  const units = binary
    ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB"]
    : ["B", "KB", "MB", "GB", "TB", "PB"];
  const base = binary ? 1024 : 1000;

  if (bytes === 0) return "0 B";

  const i = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, i);

  return `${value.toFixed(2)} ${units[i]}`;
}
