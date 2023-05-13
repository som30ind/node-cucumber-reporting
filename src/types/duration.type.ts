export type DurationSpecKeys = 'ms' | 'secs' | 'mins' | 'hrs' | 'days';

export interface DurationFormatOptions {
  separators?: Partial<Record<DurationSpecKeys, string>>;
  includeZero?: boolean;
  hideUnits?: DurationSpecKeys[];
}

export interface DurationConvertOptions {
  includeZero?: boolean;
}

export type Duration = Partial<Record<DurationSpecKeys, number>>;

export interface DurationFormatSpecs {
  factor: number;
  value: number;
  separator: string;
  digits?: number;
  hide?: boolean;
}
