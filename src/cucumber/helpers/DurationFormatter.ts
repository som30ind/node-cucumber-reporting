import { cloneDeep } from 'lodash';
import { Duration, DurationConvertOptions, DurationFormatOptions, DurationFormatSpecs, DurationSpecKeys } from '../../types/duration.type';

export class DurationFormatter {
  private static readonly SPECS: Record<DurationSpecKeys, DurationFormatSpecs> = {
    ms: { factor: 1e9, value: 1e6, separator: '', digits: 3 },
    secs: { factor: 60, value: 1, separator: '.', digits: 2 },
    mins: { factor: 60, value: 1, separator: ':', digits: 2 },
    hrs: { factor: 24, value: 1, separator: ':', digits: 2 },
    days: { factor: 0, value: 1, separator: ' ' }
  };

  public static convertToDuration(durationInNanoSeconds: number, options: DurationConvertOptions = {}): Duration {
    const specKeys = Object.keys(DurationFormatter.SPECS) as DurationSpecKeys[];
    const calculatedDurations = {} as Duration;

    for (const key of specKeys) {
      const { factor, value, digits } = DurationFormatter.SPECS[key];
      let calculated = 0;

      if (durationInNanoSeconds > 0) {
        if (Number.isInteger(factor) && factor > 0) {
          const modCalculated = durationInNanoSeconds % factor;
          durationInNanoSeconds = (durationInNanoSeconds - modCalculated) / factor;
          calculated = modCalculated / value;
        } else {
          calculated = durationInNanoSeconds;
          durationInNanoSeconds = 0;
        }
      }

      const { carriage, unitValue } = DurationFormatter.calculateUnitValue(calculated, digits ?? 0);
      calculatedDurations[key] = unitValue;
      durationInNanoSeconds += carriage;

      if (!options.includeZero && durationInNanoSeconds === 0) {
        break;
      }
    }

    return calculatedDurations;
  }

  private static combineSpecs(options: DurationFormatOptions): Record<DurationSpecKeys, DurationFormatSpecs> {
    const specKeys = Object.keys(DurationFormatter.SPECS) as DurationSpecKeys[];
    const formatSpec = {} as Record<DurationSpecKeys, DurationFormatSpecs>;
    const hideUnits = Array.isArray(options.hideUnits) ? options.hideUnits : ['days'] as DurationSpecKeys[];

    for (const key of specKeys) {
      const separator = options.separators?.[key];

      formatSpec[key] = {
        ...cloneDeep(DurationFormatter.SPECS[key])
      };

      if (separator !== undefined) {
        formatSpec[key].separator = separator;
      }

      formatSpec[key].hide = hideUnits.includes(key);
    }

    return formatSpec;
  }

  public static format(durationInNanoSeconds: number, options: DurationFormatOptions = {}): string {
    const specs = DurationFormatter.combineSpecs(options);
    const calculatedDurations = DurationFormatter.convertToDuration(durationInNanoSeconds, {
      includeZero: !!options.includeZero
    });

    let formatted = '';
    const specKeys = Object.keys(DurationFormatter.SPECS) as DurationSpecKeys[];
    let carriage = 0;

    for (const key of specKeys) {
      const { separator, hide, digits } = specs[key];
      let unitValue = (calculatedDurations[key] ?? 0) + carriage;

      if (unitValue === 0 && hide) {
        continue;
      }

      const formatResult = DurationFormatter.ensureLength(unitValue, digits ?? 0);
      formatted = `${formatResult.strValue}${formatted.length === 0 && /[\.|\:]+/g.test(separator) ? '' : separator}${formatted}`;
      carriage = formatResult.carriage;
      // console.log({ key, formatted, unitValue, separator, formatResult });
    }

    return formatted;
  }

  private static calculateUnitValue(value: number, digits: number): { carriage: number; unitValue: number; } {
    if (digits <= 0) {
      return { carriage: 0, unitValue: value };
    }

    const precisionValue = +value.toPrecision(digits);
    const digitFactor = Math.pow(10, digits);
    const carriage = Math.floor(precisionValue / digitFactor);
    const unitValue = Math.round(precisionValue % digitFactor);

    return { carriage, unitValue };
  }

  private static ensureLength(value: number, digits: number): { carriage: number; strValue: string; } {
    const { carriage, unitValue } = DurationFormatter.calculateUnitValue(value, digits);
    const strValue = unitValue.toString().padStart(digits, '0');

    return { carriage, strValue };
  }
}
