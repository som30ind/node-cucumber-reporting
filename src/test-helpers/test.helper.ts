import { DurationSpecKeys } from '../types/duration.type';

const DUR_SPECS_NS: Record<DurationSpecKeys | 'mcr' | 'ns', number> = {
  'ns': 1,
  'mcr': 1e3,
  'ms': 1e6,
  'secs': 1e9,
  'mins': 60 * 1e9,
  'hrs': 60 * 60 * 1e9,
  'days': 24 * 60 * 60 * 1e9
};

const DUR_SPECS_MS: Record<DurationSpecKeys, number> = {
  'ms': 1,
  'secs': 1e3,
  'mins': 60 * 1e3,
  'hrs': 60 * 60 * 1e3,
  'days': 24 * 60 * 60 * 1e3
};

export function toNanoSecond(days: number, hours: number, mins: number, secs: number, milli: number, micro: number, nano: number): number {
  return (days * DUR_SPECS_NS.days) + (hours * DUR_SPECS_NS.hrs) + (mins * DUR_SPECS_NS.mins)
    + (secs * DUR_SPECS_NS.secs) + (milli * DUR_SPECS_NS.ms) + (micro * DUR_SPECS_NS.mcr) + (nano * DUR_SPECS_NS.ns);
}

export function toMilliSecond(days: number, hours: number, mins: number, secs: number, milli: number): number {
  return (days * DUR_SPECS_MS.days) + (hours * DUR_SPECS_MS.hrs) + (mins * DUR_SPECS_MS.mins)
    + (secs * DUR_SPECS_MS.secs) + (milli * DUR_SPECS_MS.ms);
}

export function handleException<CR, R extends Error>(callBack: () => CR): R | undefined {
  try {
    callBack();
  } catch (e: unknown) {
    return e as R | undefined;
  }
}

export function genStrArray(prefix: string, colCount: number): string[] {
  return Array(colCount).fill(1).map((_, i) => `${prefix}-${i}`);
}
