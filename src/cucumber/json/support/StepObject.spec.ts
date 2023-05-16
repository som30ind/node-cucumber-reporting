import { describe, expect, it, jest } from '@jest/globals';

import { toNanoSecond } from '../../../test-helpers/test.helper';
import { Status } from '../../../types/report.type';
import { InvalidDataException } from '../../../types/utility.type';
import { ReportStatus } from './ReportStatus';
import { StepObject } from './StepObject';

describe('StepObject', () => {
  jest.mock('../../helpers/Helper');
  jest.mock('./ReportStatus');
  jest.mock('./StatusCounter');

  const constructorCase: {
    input: string;
    exceptionThrown: boolean;
  }[] = [
      { input: undefined as unknown as string, exceptionThrown: true },
      { input: '', exceptionThrown: true },
      { input: '27', exceptionThrown: false },
    ];

  for (const { input, exceptionThrown } of constructorCase) {
    it(`Should be able to create instance with new StepObject(${input})`, () => {
      let exception: any;

      try {
        new StepObject(input);
      } catch (e) {
        exception = e;
      }

      if (exceptionThrown) {
        expect(exception).toBeInstanceOf(InvalidDataException);
      } else {
        expect(exception).toBeUndefined();
      }
    });
  }

  const testDurations = [
    toNanoSecond(0, 0, 22, 55, 781, 100, 253),
    toNanoSecond(0, 0, 11, 48, 222, 654, 989),
    toNanoSecond(0, 0, 3, 5, 124, 50, 21),
  ];

  const duration = testDurations.reduce((t, d) => t + d, 0);
  const formattedTotalDuration = '00:37:49.128';
  const averageDuration = duration / 3;
  const formattedAverageDuration = '00:12:36.376';
  const maxDuration = Math.max(...testDurations);
  const formattedMaxDuration = '00:22:55.781';
  const totalOccurrences = 3;

  const addDurationCase: {
    input: {
      location: string;
      duration: {
        duration: number;
        status: Status;
      }[];
    };
    expected: {
      duration: number;
      formattedTotalDuration: string;
      averageDuration: number;
      formattedAverageDuration: string;
      totalOccurrences: number;
      maxDuration: number;
      formattedMaxDuration: string;
      percentageResult: string;
      status: Status;
      location: string;
    };
  }[] = [
      {
        input: {
          location: '29',
          duration: [
            {
              duration: testDurations[0],
              status: 'PASSED'
            },
            {
              duration: testDurations[1],
              status: 'PASSED'
            },
            {
              duration: testDurations[2],
              status: 'PASSED'
            }
          ]
        },
        expected: {
          averageDuration,
          formattedAverageDuration,
          duration,
          formattedTotalDuration,
          maxDuration,
          formattedMaxDuration,
          percentageResult: '100.00%',
          status: 'PASSED',
          totalOccurrences,
          location: '29',
        }
      },
      {
        input: {
          location: '55',
          duration: [
            {
              duration: testDurations[0],
              status: 'PASSED'
            },
            {
              duration: testDurations[1],
              status: 'FAILED'
            },
            {
              duration: testDurations[2],
              status: 'SKIPPED'
            }
          ]
        },
        expected: {
          averageDuration,
          formattedAverageDuration,
          duration,
          formattedTotalDuration,
          maxDuration,
          formattedMaxDuration,
          percentageResult: '33.33%',
          status: 'FAILED',
          totalOccurrences,
          location: '55'
        }
      },
      {
        input: {
          location: '55',
          duration: [
            {
              duration: testDurations[0],
              status: 'PASSED'
            },
            {
              duration: testDurations[1],
              status: 'PASSED'
            },
            {
              duration: testDurations[2],
              status: 'SKIPPED'
            }
          ]
        },
        expected: {
          averageDuration,
          formattedAverageDuration,
          duration,
          formattedTotalDuration,
          maxDuration,
          formattedMaxDuration,
          percentageResult: '66.67%',
          status: 'FAILED',
          totalOccurrences,
          location: '55'
        }
      },
    ];

  for (const { input, expected } of addDurationCase) {
    it(`Should perform validation on StepObject(${input.location} with ${JSON.stringify(input.duration)})`, () => {
      const so = new StepObject(input.location);

      for (const { duration, status } of input.duration) {
        so.addDuration(duration, new ReportStatus(status));
      }

      expect(so.location).toEqual(expected.location);
      expect(so.getDuration()).toEqual(expected.duration);
      expect(so.getFormattedTotalDuration()).toEqual(expected.formattedTotalDuration);
      expect(so.getAverageDuration()).toEqual(expected.averageDuration);
      expect(so.getFormattedAverageDuration()).toEqual(expected.formattedAverageDuration);
      expect(so.getTotalOccurrences()).toEqual(expected.totalOccurrences);
      expect(so.getMaxDuration()).toEqual(expected.maxDuration);
      expect(so.getFormattedMaxDuration()).toEqual(expected.formattedMaxDuration);
      expect(so.getPercentageResult()).toEqual(expected.percentageResult);
      expect(so.getStatus()).toEqual(new ReportStatus(expected.status));
    });
  }
});
