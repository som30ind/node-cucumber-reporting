import { describe, expect, it } from '@jest/globals';
import { toNanoSecond } from '../../test-helpers/test.helper';
import { DurationConvertOptions, DurationFormatOptions, DurationSpecKeys } from '../../types/duration.type';
import { DurationFormatter } from './DurationFormatter';

describe('DurationFormatter', () => {
  const convertDuration: {
    input: number;
    option?: DurationConvertOptions;
    expected: Partial<Record<DurationSpecKeys, number>>;
  }[] = [
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: { ms: 0 } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: { ms: 0 } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: { ms: 0 } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: { ms: 1 } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: { ms: 0, secs: 1 } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 1 } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 1 } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 0, days: 1 } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 999), expected: { ms: 0 } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 999, 999), expected: { ms: 1 } },
      { input: toNanoSecond(0, 0, 0, 0, 999, 999, 999), expected: { ms: 0, secs: 1 } },
      { input: toNanoSecond(0, 0, 0, 59, 999, 999, 999), expected: { ms: 0, secs: 0, mins: 1 } },
      { input: toNanoSecond(0, 0, 59, 59, 999, 999, 999), expected: { ms: 0, secs: 0, mins: 0, hrs: 1 } },
      { input: toNanoSecond(0, 24, 59, 59, 999, 999, 999), expected: { ms: 0, secs: 0, mins: 0, hrs: 1, days: 1 } },
      { input: toNanoSecond(55, 24, 59, 59, 999, 999, 999), expected: { ms: 0, secs: 0, mins: 0, hrs: 1, days: 56 } },
      { input: toNanoSecond(55, 24, 60, 60, 1000, 1000, 1000), expected: { ms: 1, secs: 1, mins: 1, hrs: 1, days: 56 } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: { ms: 0 }, option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: { ms: 0 }, option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: { ms: 0 }, option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: { ms: 1 }, option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: { ms: 0, secs: 1 }, option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 1 }, option: { includeZero: false } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 1 }, option: { includeZero: false } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 0, days: 1 }, option: { includeZero: false } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 0, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: { ms: 0, secs: 0, mins: 0, hrs: 0, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 0, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: { ms: 1, secs: 0, mins: 0, hrs: 0, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: { ms: 0, secs: 1, mins: 0, hrs: 0, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 1, hrs: 0, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 1, days: 0 }, option: { includeZero: true } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: { ms: 0, secs: 0, mins: 0, hrs: 0, days: 1 }, option: { includeZero: true } },
    ];

  const formatDuration: {
    input: number;
    option?: DurationFormatOptions;
    expected: string;
  }[] = [
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '00:00:00.000' },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: '00:00:00.000' },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: '00:00:00.000' },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: '00:00:00.001' },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: '00:00:01.000' },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: '00:01:00.000' },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: '01:00:00.000' },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: '1 00:00:00.000' },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 999), expected: '00:00:00.000' },
      { input: toNanoSecond(0, 0, 0, 0, 0, 999, 999), expected: '00:00:00.001' },
      { input: toNanoSecond(0, 0, 0, 0, 999, 999, 999), expected: '00:00:01.000' },
      { input: toNanoSecond(0, 0, 0, 59, 999, 999, 999), expected: '00:01:00.000' },
      { input: toNanoSecond(0, 0, 59, 59, 999, 999, 999), expected: '01:00:00.000' },
      { input: toNanoSecond(0, 24, 59, 59, 999, 999, 999), expected: '1 01:00:00.000' },
      { input: toNanoSecond(55, 24, 59, 59, 999, 999, 999), expected: '56 01:00:00.000' },
      { input: toNanoSecond(55, 24, 60, 60, 1000, 1000, 1000), expected: '56 01:01:01.001' },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '00:00:00.000', option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: '00:00:00.000', option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: '00:00:00.000', option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: '00:00:00.001', option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: '00:00:01.000', option: { includeZero: false } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: '00:01:00.000', option: { includeZero: false } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: '01:00:00.000', option: { includeZero: false } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: '1 00:00:00.000', option: { includeZero: false } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '00:00:00.000', option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: '00:00:00.000', option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: '00:00:00.000', option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: '00:00:00.001', option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: '00:00:01.000', option: { includeZero: true } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: '00:01:00.000', option: { includeZero: true } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: '01:00:00.000', option: { includeZero: true } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: '1 00:00:00.000', option: { includeZero: true } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '0 00:00:00.000', option: { hideUnits: [] } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 1), expected: '0 00:00:00.000', option: { hideUnits: [] } },
      { input: toNanoSecond(0, 0, 0, 0, 0, 1, 0), expected: '0 00:00:00.000', option: { hideUnits: [] } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: '0 00:00:00.001', option: { hideUnits: [] } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: '0 00:00:01.000', option: { hideUnits: [] } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: '0 00:01:00.000', option: { hideUnits: [] } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: '0 01:00:00.000', option: { hideUnits: [] } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: '1 00:00:00.000', option: { hideUnits: [] } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '00:00:00.000', option: { hideUnits: ['days'] } },
      { input: toNanoSecond(1, 0, 0, 0, 0, 0, 0), expected: '1 00:00:00.000', option: { hideUnits: ['days'] } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '0 00:00.000', option: { hideUnits: ['hrs'] } },
      { input: toNanoSecond(0, 1, 0, 0, 0, 0, 0), expected: '0 01:00:00.000', option: { hideUnits: ['hrs'] } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '0 00:00.000', option: { hideUnits: ['mins'] } },
      { input: toNanoSecond(0, 0, 1, 0, 0, 0, 0), expected: '0 00:01:00.000', option: { hideUnits: ['mins'] } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '0 00:00:000', option: { hideUnits: ['secs'] } },
      { input: toNanoSecond(0, 0, 0, 1, 0, 0, 0), expected: '0 00:00:01.000', option: { hideUnits: ['secs'] } },

      { input: toNanoSecond(0, 0, 0, 0, 0, 0, 0), expected: '0 00:00:00', option: { hideUnits: ['ms'] } },
      { input: toNanoSecond(0, 0, 0, 0, 1, 0, 0), expected: '0 00:00:00.001', option: { hideUnits: ['ms'] } },

      { input: toNanoSecond(1, 1, 1, 1, 1, 1, 1), expected: '1 Days 01 Hours 01 Minutes 01 Seconds 001 Milliseconds', option: { separators: { ms: ' Milliseconds', secs: ' Seconds ', mins: ' Minutes ', hrs: ' Hours ', days: ' Days ' } } },
    ];

  let counter = 1;
  for (const { input, option, expected } of convertDuration) {
    it(`${counter}. Should be able to convert duration with convertToDuration(${input}${option ? `, ${JSON.stringify(option)}` : ''})`, () => {
      if (option) {
        expect(DurationFormatter.convertToDuration(input, option)).toEqual(expected);
      } else {
        expect(DurationFormatter.convertToDuration(input)).toEqual(expected);
      }
    });

    counter++;
  }

  counter = 1;
  for (const { input, option, expected } of formatDuration) {
    it(`${counter}. Should be able to format duration with format(${input}${option ? `, ${JSON.stringify(option)}` : ''})`, () => {
      if (option) {
        expect(DurationFormatter.format(input, option)).toEqual(expected);
      } else {
        expect(DurationFormatter.format(input)).toEqual(expected);
      }
    });

    counter++;
  }
});
