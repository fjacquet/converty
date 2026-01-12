export interface BPMConversion {
  bpm: number;
  hz: number;
  msPerBeat: number;
  secPerBeat: number;
  beatsPerSec: number;
  barLength4_4: number; // ms for a 4/4 bar
  barLength3_4: number; // ms for a 3/4 bar
  noteValues: NoteValue[];
}

export interface NoteValue {
  name: string;
  symbol: string;
  beats: number;
  durationMs: number;
}

export function calculateBPM(bpm: number): BPMConversion | null {
  if (bpm <= 0 || bpm > 1000) {
    return null;
  }

  const msPerBeat = 60000 / bpm;
  const secPerBeat = 60 / bpm;
  const hz = bpm / 60;

  const noteValues: NoteValue[] = [
    { name: "Whole note", symbol: "1", beats: 4, durationMs: msPerBeat * 4 },
    { name: "Half note", symbol: "1/2", beats: 2, durationMs: msPerBeat * 2 },
    { name: "Quarter note", symbol: "1/4", beats: 1, durationMs: msPerBeat },
    { name: "Eighth note", symbol: "1/8", beats: 0.5, durationMs: msPerBeat / 2 },
    { name: "Sixteenth note", symbol: "1/16", beats: 0.25, durationMs: msPerBeat / 4 },
    { name: "Thirty-second note", symbol: "1/32", beats: 0.125, durationMs: msPerBeat / 8 },
    { name: "Dotted half", symbol: "1/2.", beats: 3, durationMs: msPerBeat * 3 },
    { name: "Dotted quarter", symbol: "1/4.", beats: 1.5, durationMs: msPerBeat * 1.5 },
    { name: "Dotted eighth", symbol: "1/8.", beats: 0.75, durationMs: msPerBeat * 0.75 },
    { name: "Triplet quarter", symbol: "1/4T", beats: 2 / 3, durationMs: (msPerBeat * 2) / 3 },
    { name: "Triplet eighth", symbol: "1/8T", beats: 1 / 3, durationMs: msPerBeat / 3 },
  ];

  return {
    bpm,
    hz: Math.round(hz * 1000) / 1000,
    msPerBeat: Math.round(msPerBeat * 100) / 100,
    secPerBeat: Math.round(secPerBeat * 1000) / 1000,
    beatsPerSec: Math.round(hz * 1000) / 1000,
    barLength4_4: Math.round(msPerBeat * 4 * 100) / 100,
    barLength3_4: Math.round(msPerBeat * 3 * 100) / 100,
    noteValues: noteValues.map((n) => ({
      ...n,
      durationMs: Math.round(n.durationMs * 100) / 100,
    })),
  };
}

export function msToDelay(ms: number, sampleRate: number = 44100): number {
  return Math.round((ms / 1000) * sampleRate);
}

export function bpmFromMs(msPerBeat: number): number {
  return 60000 / msPerBeat;
}

// Common tempo markings
export const TEMPO_MARKINGS = [
  { name: "Larghissimo", minBpm: 1, maxBpm: 24 },
  { name: "Grave", minBpm: 25, maxBpm: 45 },
  { name: "Largo", minBpm: 40, maxBpm: 60 },
  { name: "Lento", minBpm: 45, maxBpm: 60 },
  { name: "Larghetto", minBpm: 60, maxBpm: 66 },
  { name: "Adagio", minBpm: 66, maxBpm: 76 },
  { name: "Andante", minBpm: 76, maxBpm: 108 },
  { name: "Moderato", minBpm: 108, maxBpm: 120 },
  { name: "Allegro", minBpm: 120, maxBpm: 156 },
  { name: "Vivace", minBpm: 156, maxBpm: 176 },
  { name: "Presto", minBpm: 168, maxBpm: 200 },
  { name: "Prestissimo", minBpm: 200, maxBpm: 1000 },
];

export function getTempoMarking(bpm: number): string {
  for (const marking of TEMPO_MARKINGS) {
    if (bpm >= marking.minBpm && bpm <= marking.maxBpm) {
      return marking.name;
    }
  }
  return "Unknown";
}
