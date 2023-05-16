import { DurationSpecKeys } from '../types/duration.type';

const DUR_SPECS: Record<DurationSpecKeys | 'mcr' | 'ns', number> = {
  'ns': 0,
  'mcr': 1e3,
  'ms': 1e6,
  'secs': 1e9,
  'mins': 60 * 1e9,
  'hrs': 60 * 60 * 1e9,
  'days': 24 * 60 * 60 * 1e9
};

export function toNanoSecond(days: number, hours: number, mins: number, secs: number, milli: number, micro: number, nano: number): number {
  return (days * DUR_SPECS.days) + (hours * DUR_SPECS.hrs) + (mins * DUR_SPECS.mins)
    + (secs * DUR_SPECS.secs) + (milli * DUR_SPECS.ms) + (micro * DUR_SPECS.mcr) + (nano * DUR_SPECS.ns);
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
