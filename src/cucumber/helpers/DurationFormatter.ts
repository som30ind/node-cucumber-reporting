import { Duration, DurationConvertOptions, DurationFormatOptions, DurationFormatSpecs, DurationSpecKeys } from '../../types/duration.type';

export class DurationFormatter {
  private static readonly SPECS: Record<DurationSpecKeys, DurationFormatSpecs> = {
    ms: { value: 1000 * 1000 * 1000, separator: '', digits: 3 },
    secs: { value: 60, separator: '.', digits: 2 },
    mins: { value: 60, separator: ':', digits: 2 },
    hrs: { value: 24, separator: ':', digits: 2 },
    days: { value: 0, separator: ' ' }
  };

  public static convertToDuration(durationInMilliSeconds: number, options: DurationConvertOptions = {}): Duration {
    const specKeys = Object.keys(DurationFormatter.SPECS) as DurationSpecKeys[];
    const calculatedDurations = {} as Duration;

    for (const key of specKeys) {
      const { value, digits } = DurationFormatter.SPECS[key];
      let calculated = 0;

      if (durationInMilliSeconds > 0) {
        if (Number.isInteger(value) && value > 0) {
          calculated = durationInMilliSeconds % value;
          durationInMilliSeconds = (durationInMilliSeconds - calculated) / value;
        } else {
          calculated = durationInMilliSeconds;
          durationInMilliSeconds = 0;
        }
      }

      calculatedDurations[key] = calculated;

      if (!options.includeZero && durationInMilliSeconds === 0) {
        break;
      }
    }

    return calculatedDurations;
  }

  private static combineSpecs(options: DurationFormatOptions): Record<DurationSpecKeys, DurationFormatSpecs> {
    const specKeys = Object.keys(DurationFormatter.SPECS) as DurationSpecKeys[];
    const formatSpec = {} as Record<DurationSpecKeys, DurationFormatSpecs>;
    options = options ?? {};
    const hideUnits = Array.isArray(options.hideUnits) ? options.hideUnits : ['days'] as DurationSpecKeys[];

    for (const key of specKeys) {
      const separator = options.separators?.[key];

      formatSpec[key] = {
        ...DurationFormatter.SPECS[key]
      };

      if (separator !== undefined) {
        formatSpec[key].separator = separator;
      }

      formatSpec[key].hide = hideUnits.includes(key);
    }

    return formatSpec;
  }

  public static format(durationInMilliSeconds: number, options: DurationFormatOptions = {}): string {
    const specs = DurationFormatter.combineSpecs(options);
    const calculatedDurations = DurationFormatter.convertToDuration(durationInMilliSeconds, {
      includeZero: !!options.includeZero
    });

    let formatted = '';
    const specKeys = Object.keys(DurationFormatter.SPECS) as DurationSpecKeys[];

    for (const key of specKeys) {
      const { separator, hide, digits } = specs[key];
      const unitValue = calculatedDurations[key] ?? 0;

      if (unitValue === 0 && hide) {
        continue;
      }

      const unitValueStr = DurationFormatter.ensureLength(unitValue, digits ?? 0);
      formatted = `${unitValueStr}${separator}${formatted}`;
    }

    return formatted;
  }

  private static ensureLength(value: number, digits: number): string {
    const strValue = `${value}`;

    if (digits > 0) {
      if (strValue.length < digits) {
        return strValue.padStart(digits, '0');
      }

      if (strValue.length > 0) {
        return strValue.substring(0, digits);
      }
    }

    return strValue;
  }
}
