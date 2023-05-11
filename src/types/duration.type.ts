export type DurationSpecKeys = 'ms' | 'secs' | 'mins' | 'hrs' | 'days';

export interface DurationFormatOptions {
  separators?: Record<DurationSpecKeys, string>;
  includeZero?: boolean;
  hideUnits?: DurationSpecKeys[];
  digits?: Record<DurationSpecKeys, number>;
}

export interface DurationConvertOptions {
  includeZero?: boolean;
}

export type Duration = Record<DurationSpecKeys, number>;

export interface DurationFormatSpecs {
  value: number;
  separator: string;
  digits?: number;
  hide?: boolean;
}
