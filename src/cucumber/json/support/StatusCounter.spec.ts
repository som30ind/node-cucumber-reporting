import { describe, expect, it } from '@jest/globals';

import { Status } from '../../../types/report.type';
import { MResult } from '../Result';
import { ReportStatus } from './ReportStatus';
import { Resultsable } from './Resultable';
import { StatusCounter } from './StatusCounter';

describe('StatusCounter', () => {
  function genResultableWithStatus(status: Status): Resultsable {
    return {
      getResult() {
        return {
          status: new ReportStatus(status),
        } as MResult;
      },
      getMatch() {
        return {};
      },
      getOutputs() {
        return [];
      }
    };
  }

  const isPassed: {
    input: {
      resultsables?: Resultsable[];
      notFailingStatuses?: Status[];
      incrementFor: Partial<Record<Status, number>>;
    };
    expected: {
      size: number;
      finalStatus: Status;
      valueForInitial: Record<Status, number>;
      valueFor: Record<Status, number>;
    };
  }[] = [
      {
        input: {
          incrementFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 5, 'SKIPPED': 4 },
        },
        expected: {
          size: 0,
          finalStatus: 'PASSED',
          valueForInitial: { 'PASSED': 0, 'FAILED': 0, 'AMBIGUOUS': 0, 'SKIPPED': 0, 'PENDING': 0, 'UNDEFINED': 0 },
          valueFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 0, 'SKIPPED': 4, 'PENDING': 0, 'UNDEFINED': 5 },
        }
      },
      {
        input: {
          resultsables: [],
          incrementFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 5, 'SKIPPED': 4 },
        },
        expected: {
          size: 0,
          finalStatus: 'PASSED',
          valueForInitial: { 'PASSED': 0, 'FAILED': 0, 'AMBIGUOUS': 0, 'SKIPPED': 0, 'PENDING': 0, 'UNDEFINED': 0 },
          valueFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 0, 'SKIPPED': 4, 'PENDING': 0, 'UNDEFINED': 5 },
        }
      },
      {
        input: {
          notFailingStatuses: [],
          incrementFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 5, 'SKIPPED': 4 },
        },
        expected: {
          size: 0,
          finalStatus: 'PASSED',
          valueForInitial: { 'PASSED': 0, 'FAILED': 0, 'AMBIGUOUS': 0, 'SKIPPED': 0, 'PENDING': 0, 'UNDEFINED': 0 },
          valueFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 0, 'SKIPPED': 4, 'PENDING': 0, 'UNDEFINED': 5 },
        }
      },
      {
        input: {
          resultsables: [],
          notFailingStatuses: [],
          incrementFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 5, 'SKIPPED': 4 },
        },
        expected: {
          size: 0,
          finalStatus: 'PASSED',
          valueForInitial: { 'PASSED': 0, 'FAILED': 0, 'AMBIGUOUS': 0, 'SKIPPED': 0, 'PENDING': 0, 'UNDEFINED': 0 },
          valueFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 0, 'SKIPPED': 4, 'PENDING': 0, 'UNDEFINED': 5 },
        }
      },
      {
        input: {
          resultsables: [
            genResultableWithStatus('AMBIGUOUS'),
            genResultableWithStatus('PASSED'),
            genResultableWithStatus('FAILED'),
            genResultableWithStatus('SKIPPED'),
          ],
          notFailingStatuses: [],
          incrementFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 5, 'SKIPPED': 4 },
        },
        expected: {
          size: 4,
          finalStatus: 'FAILED',
          valueForInitial: { 'PASSED': 1, 'FAILED': 1, 'AMBIGUOUS': 0, 'SKIPPED': 1, 'PENDING': 0, 'UNDEFINED': 1 },
          valueFor: { 'PASSED': 4, 'FAILED': 3, 'AMBIGUOUS': 0, 'SKIPPED': 5, 'PENDING': 0, 'UNDEFINED': 6 },
        }
      },
      {
        input: {
          resultsables: [
            genResultableWithStatus('AMBIGUOUS'),
            genResultableWithStatus('PASSED'),
            genResultableWithStatus('FAILED'),
            genResultableWithStatus('SKIPPED'),
          ],
          notFailingStatuses: ['SKIPPED', 'PENDING', 'UNDEFINED'],
          incrementFor: { 'PASSED': 3, 'FAILED': 2, 'AMBIGUOUS': 5, 'SKIPPED': 4 },
        },
        expected: {
          size: 4,
          finalStatus: 'FAILED',
          valueForInitial: { 'PASSED': 3, 'FAILED': 1, 'AMBIGUOUS': 0, 'SKIPPED': 0, 'PENDING': 0, 'UNDEFINED': 0 },
          valueFor: { 'PASSED': 15, 'FAILED': 3, 'AMBIGUOUS': 0, 'SKIPPED': 0, 'PENDING': 0, 'UNDEFINED': 0 },
        }
      },
    ];

  for (const { input, expected } of isPassed) {
    it(`Should be able to get result StatusCounter(${JSON.stringify(input)})`, () => {
      const st = new StatusCounter(input.resultsables, input.notFailingStatuses);
      expect(st.size).toEqual(expected.size);
      expect(st.finalStatus).toEqual(new ReportStatus(expected.finalStatus));

      const valueForInitKeys = Object.keys(expected.valueForInitial) as Status[];

      for (const k of valueForInitKeys) {
        expect(st.getValueFor(k)).toEqual(expected.valueForInitial[k]);
      }

      const incrementForKeys = Object.keys(input.incrementFor) as Status[];

      for (const k of incrementForKeys) {
        const s = new ReportStatus(k);

        for (let i = 0; i < (input.incrementFor[k] ?? 0); i++) {
          st.incrementFor(s);
        }
      }

      const valueForKeys = Object.keys(expected.valueFor) as Status[];

      for (const k of valueForKeys) {
        expect(st.getValueFor(k)).toEqual(expected.valueFor[k]);
      }
    });
  }
});
