import { describe, expect, it } from '@jest/globals';

import { Status } from '../../../types/report.type';
import { ReportStatus } from './ReportStatus';

describe('StatusCounter', () => {
  const isPassed: {
    input: Status;
    expected: boolean;
  }[] = [
      { input: 'AMBIGUOUS', expected: false },
      { input: 'FAILED', expected: false },
      { input: 'PASSED', expected: true },
      { input: 'PENDING', expected: false },
      { input: 'SKIPPED', expected: false },
      { input: 'UNDEFINED', expected: false },
      { input: 'anything' as Status, expected: false },
      { input: 'pAssed' as Status, expected: true },
      { input: 'sKippEd' as Status, expected: false },
    ];

  for (const { input, expected } of isPassed) {
    it(`Should be able to get result ReportStatus(${input}).isPassed`, () => {
      const st = new ReportStatus(input);
      const actual = st.isPassed;
      expect(actual).toEqual(expected);
    });
  }

  const label: {
    input: Status;
    expected: string;
  }[] = [
      { input: 'AMBIGUOUS', expected: 'Undefined' },
      { input: 'FAILED', expected: 'Failed' },
      { input: 'PASSED', expected: 'Passed' },
      { input: 'PENDING', expected: 'Pending' },
      { input: 'SKIPPED', expected: 'Skipped' },
      { input: 'UNDEFINED', expected: 'Undefined' },
      { input: 'anything' as Status, expected: 'Undefined' },
      { input: 'pAssed' as Status, expected: 'Passed' },
      { input: 'sKippEd' as Status, expected: 'Skipped' },
    ];

  for (const { input, expected } of label) {
    it(`Should be able to get result ReportStatus(${input}).label`, () => {
      const st = new ReportStatus(input);
      const actual = st.label;
      expect(actual).toEqual(expected);
    });
  }

  const rawName: {
    input: Status;
    expected: string;
  }[] = [
      { input: 'AMBIGUOUS', expected: 'undefined' },
      { input: 'FAILED', expected: 'failed' },
      { input: 'PASSED', expected: 'passed' },
      { input: 'PENDING', expected: 'pending' },
      { input: 'SKIPPED', expected: 'skipped' },
      { input: 'UNDEFINED', expected: 'undefined' },
      { input: 'anything' as Status, expected: 'undefined' },
      { input: 'pAssed' as Status, expected: 'passed' },
      { input: 'sKippEd' as Status, expected: 'skipped' },
    ];

  for (const { input, expected } of rawName) {
    it(`Should be able to get result ReportStatus(${input}).rawName`, () => {
      const st = new ReportStatus(input);
      const actual = st.rawName;
      expect(actual).toEqual(expected);
    });
  }

  const validatedStatus: {
    input: Status;
    expected: Status;
  }[] = [
      { input: 'AMBIGUOUS', expected: 'UNDEFINED' },
      { input: 'FAILED', expected: 'FAILED' },
      { input: 'PASSED', expected: 'PASSED' },
      { input: 'PENDING', expected: 'PENDING' },
      { input: 'SKIPPED', expected: 'SKIPPED' },
      { input: 'UNDEFINED', expected: 'UNDEFINED' },
      { input: 'anything' as Status, expected: 'UNDEFINED' },
      { input: 'pAssed' as Status, expected: 'PASSED' },
      { input: 'sKippEd' as Status, expected: 'SKIPPED' },
    ];

  for (const { input, expected } of validatedStatus) {
    it(`Should be able to get result ReportStatus.validatedStatus(${input})`, () => {
      const actual = ReportStatus.validatedStatus(input);
      expect(actual).toEqual(expected);
    });
  }
});
