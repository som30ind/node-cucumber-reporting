import { describe, expect, it, jest } from '@jest/globals';

import { parseISO } from 'date-fns';
import { cloneDeep } from 'lodash';
import { toNanoSecond } from '../../test-helpers/test.helper';
import { Configuration } from '../Configuration';
import { IHasContent } from '../json/support/IHasContent';
import { Helper } from './Helper';

jest.mock('../Configuration');

describe('Helper', () => {
  it(`Should be able to get response with mapJsonArray(configuration, jsonData, mappingFunction)`, () => {
    const mockCallback = jest.fn((conf: Configuration, data: number) => ({ data }));
    const conf = new Configuration();

    const actual = Helper.mapJsonArray(conf, [1, 2, 3], mockCallback);
    expect(actual).not.toBeUndefined();
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, conf, 1);
    expect(mockCallback).toHaveBeenNthCalledWith(2, conf, 2);
    expect(mockCallback).toHaveBeenNthCalledWith(3, conf, 3);
    expect(mockCallback).toHaveNthReturnedWith(1, { data: 1 });
    expect(mockCallback).toHaveNthReturnedWith(2, { data: 2 });
    expect(mockCallback).toHaveNthReturnedWith(3, { data: 3 });
    expect(actual).toEqual([{ data: 1 }, { data: 2 }, { data: 3 }]);
  });

  it(`Should be able to get response with mapJsonArray(configuration, [], mappingFunction)`, () => {
    const mockCallback = jest.fn((conf: Configuration, data: number) => ({ data }));
    const conf = new Configuration();

    const actual = Helper.mapJsonArray(conf, [], mockCallback);
    expect(actual).not.toBeUndefined();
    expect(mockCallback).toHaveBeenCalledTimes(0);
    expect(actual).toEqual([]);
  });

  it(`Should be able to get response with mapJsonArray(configuration, undefined, mappingFunction)`, () => {
    const mockCallback = jest.fn((conf: Configuration, data: number) => ({ data }));
    const conf = new Configuration();

    const actual = Helper.mapJsonArray(conf, undefined, mockCallback);
    expect(actual).not.toBeUndefined();
    expect(mockCallback).toHaveBeenCalledTimes(0);
    expect(actual).toEqual([]);
  });

  it(`Should be able to get response with mapJson(configuration, jsonData, mappingFunction)`, () => {
    const mockCallback = jest.fn((conf: Configuration, input: { value: number; }) => ({ label: `Label ${input.value}` }));
    const conf = new Configuration();

    const actual = Helper.mapJson(conf, { value: 1 }, mockCallback);
    expect(actual).not.toBeUndefined();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenNthCalledWith(1, conf, { value: 1 });
    expect(mockCallback).toHaveNthReturnedWith(1, { label: `Label 1` });
    expect(actual).toEqual({ label: `Label 1` });
  });

  it(`Should be able to get response with mapJson(configuration, undefined, mappingFunction)`, () => {
    const mockCallback = jest.fn((conf: Configuration, input: { value: number; }) => ({ label: `Label ${input.value}` }));
    const conf = new Configuration();

    const actual = Helper.mapJson(conf, undefined, mockCallback);
    expect(actual).toBeUndefined();
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it(`Should be able to get response with isOptionalString('Test')`, () => {
    const actual = Helper.isOptionalString('Test');
    expect(actual).toBeTruthy();
  });

  it(`Should be able to get response with isOptionalString(undefined)`, () => {
    const actual = Helper.isOptionalString(undefined);
    expect(actual).toBeTruthy();
  });

  it(`Should be able to get response with isOptionalString(24)`, () => {
    const actual = Helper.isOptionalString(24);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isOptionalString({ value: 25 })`, () => {
    const actual = Helper.isOptionalString({ value: 25 });
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isOptionalInteger('Test')`, () => {
    const actual = Helper.isOptionalInteger('Test');
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isOptionalInteger(undefined)`, () => {
    const actual = Helper.isOptionalInteger(undefined);
    expect(actual).toBeTruthy();
  });

  it(`Should be able to get response with isOptionalInteger(24)`, () => {
    const actual = Helper.isOptionalInteger(24);
    expect(actual).toBeTruthy();
  });

  it(`Should be able to get response with isOptionalInteger(22.65)`, () => {
    const actual = Helper.isOptionalInteger(22.65);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isOptionalInteger({ value: 25 })`, () => {
    const actual = Helper.isOptionalInteger({ value: 25 });
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isStringArray(['Item 1', 'Item 2', 'Item 3', 'Item 4'])`, () => {
    const actual = Helper.isStringArray(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    expect(actual).toBeTruthy();
  });

  it(`Should be able to get response with isStringArray(['Item 1', 245, 'Item 3', 'Item 4'])`, () => {
    const actual = Helper.isStringArray(['Item 1', 245, 'Item 3', 'Item 4']);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isStringArray(undefined)`, () => {
    const actual = Helper.isStringArray(undefined);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isIntegerArray([1, 3, 5, 7])`, () => {
    const actual = Helper.isIntegerArray([1, 3, 5, 7]);
    expect(actual).toBeTruthy();
  });

  it(`Should be able to get response with isIntegerArray(['Item 1', 245, 'Item 3', 'Item 4'])`, () => {
    const actual = Helper.isIntegerArray([1, 3, 'Item 5', 7]);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isIntegerArray([1, 3, 2.25, 7])`, () => {
    const actual = Helper.isIntegerArray([1, 3, 2.25, 7]);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with isIntegerArray(undefined)`, () => {
    const actual = Helper.isIntegerArray(undefined);
    expect(actual).toBeFalsy();
  });

  it(`Should be able to get response with parseDate(2019-11-25T13:36:37.562Z)`, () => {
    const dateValue = '2019-11-25T13:36:37.562Z';
    const actual = Helper.parseDate(dateValue);
    expect(actual).not.toBeUndefined();
    expect(actual).toBeInstanceOf(Date);
    expect(actual).toEqual(parseISO(dateValue));
  });

  it(`Should be able to get response with parseDate(2019-11-25)`, () => {
    const dateValue = '2019-11-25';
    const actual = Helper.parseDate(dateValue);
    expect(actual).not.toBeUndefined();
    expect(actual).toBeInstanceOf(Date);
    expect(actual).toEqual(parseISO(dateValue));
  });

  it(`Should be able to get response with parseDate(2019-15-25)`, () => {
    const dateValue = '2019-15-25';
    const actual = Helper.parseDate(dateValue);
    expect(actual).toBeUndefined();
  });

  it(`Should be able to get response with parseDate(undefined)`, () => {
    const dateValue = undefined;
    const actual = Helper.parseDate(dateValue);
    expect(actual).toBeUndefined();
  });


  it(`Should be able to get response with mergeDeep(srcValue, targetValue)`, () => {
    const srcValue = { name: 'Cucumber', version: 1, status: { passedScenarios: 15, passedFeatures: 10 }, tags: ['@Tag1', '@Tag2'] };
    const targetValue = { status: { passedScenarios: 25, failedFeatures: 6 }, version: 2, tags: ['@Tag3', '@Tag2'], name: undefined };


    const clonedTargetValue = cloneDeep(targetValue);
    Helper.mergeDeep(srcValue, targetValue);

    expect(srcValue).toEqual({ name: 'Cucumber', version: 2, status: { passedScenarios: 25, passedFeatures: 10, failedFeatures: 6 }, tags: ['@Tag1', '@Tag2', '@Tag3', '@Tag2'] });
    expect(targetValue).toEqual(clonedTargetValue);
  });

  const equalsIgnoreCase: {
    input: (string | undefined)[];
    expected: boolean;
  }[] = [
      { input: [undefined, 'tesT12'], expected: false },
      { input: ['ABC', undefined], expected: false },
      { input: [undefined, undefined], expected: true },
      { input: ['Test', 'TEST'], expected: true },
      { input: ['TEST12@', 'tesT12@'], expected: true },
      { input: ['TEST12@', 'tesT12'], expected: false },
    ];

  for (const { input, expected } of equalsIgnoreCase) {
    it(`Should be able to get response with equalsIgnoreCase(${input[0]}, ${input[1]})`, () => {
      const actual = Helper.equalsIgnoreCase(input[0], input[1]);

      expect(actual).toEqual(expected);
    });
  }

  const compareIgnoreCase: {
    input: (string | undefined)[];
    expected: number;
  }[] = [
      { input: [undefined, 'ABC'], expected: -1 },
      { input: ['ABC', undefined], expected: 1 },
      { input: [undefined, undefined], expected: 0 },
      { input: ['ABC', 'ABC'], expected: 0 },
      { input: ['Abc', 'ABC'], expected: 0 },
      { input: ['Abc12@xyz', 'ABC12@Xyz'], expected: 0 },
      { input: ['Abc12@', 'ABC12@Xyz'], expected: -1 },
      { input: ['Abc12@xyz', 'ABC12@'], expected: 1 },
      { input: ['AbcD', 'XyZC'], expected: -1 },
    ];

  for (const { input, expected } of compareIgnoreCase) {
    it(`Should be able to get response with compareIgnoreCase(${input[0]}, ${input[1]})`, () => {
      const actual = Helper.compareIgnoreCase(input[0], input[1]);

      expect(actual).toEqual(expected);
    });
  }

  const formatDuration = [
    { duration: toNanoSecond(55, 24, 60, 60, 1000, 1000, 1000), expected: '56 01:01:01.001' }
  ];

  for (const { duration, expected } of formatDuration) {
    it(`Should be able to get response with formatDuration(${duration})`, () => {
      const actual = Helper.formatDuration(duration);

      expect(actual).toEqual(expected);
    });
  }

  const formatAsPercentage = [
    { input: [11, 85], expected: '12.94%' },
    { input: [75, 100], expected: '75.00%' },
    { input: [175, 100], expected: '175.00%' },
    { input: [0, 85], expected: '0.00%' },
    { input: [11, 0], expected: '0.00%' },
    { input: [0, 0], expected: '0.00%' },
  ];

  for (const { input, expected } of formatAsPercentage) {
    it(`Should be able to get response with formatAsPercentage(${input[0]}, ${input[1]})`, () => {
      const actual = Helper.formatAsPercentage(input[0], input[1]);

      expect(actual).toEqual(expected);
    });
  }

  const formatAsDecimal = [
    { input: [11, 85], expected: '12.94' },
    { input: [75, 100], expected: '75.00' },
    { input: [175, 100], expected: '175.00' },
    { input: [0, 85], expected: '0.00' },
    { input: [11, 0], expected: '0.00' },
    { input: [0, 0], expected: '0.00' },
  ];

  for (const { input, expected } of formatAsDecimal) {
    it(`Should be able to get response with formatAsDecimal(${input[0]}, ${input[1]})`, () => {
      const actual = Helper.formatAsDecimal(input[0], input[1]);

      expect(actual).toEqual(expected);
    });
  }

  const toValidFileName = [
    { input: 'file name @#" { Content }' },
  ];
  const reValidFile = /^[^\\/:\*\?"<>\|]+$/g;

  for (const { input } of toValidFileName) {
    it(`Should be able to get response with toValidFileName(${input})`, () => {
      const actual = Helper.toValidFileName(input);

      expect(reValidFile.test(actual)).toBeTruthy();
    });
  }

  const escapeHtml = [
    { input: `<div><span>I am here</span></div>`, expected: `&lt;div&gt;&lt;span&gt;I am here&lt;/span&gt;&lt;/div&gt;` },
    { input: `<script src="https://www.example.com/js/index.js"></script>`, expected: `&lt;script src=\"https://www.example.com/js/index.js\"&gt;&lt;/script&gt;` },
    { input: `<script> function sum() { return a + b; } </script>`, expected: `&lt;script&gt; function sum() { return a + b; } &lt;/script&gt;` },
  ];

  for (const { input, expected } of escapeHtml) {
    it(`Should be able to get response with escapeHtml(${input})`, () => {
      const actual = Helper.escapeHtml(input);

      expect(actual).toEqual(expected);
    });
  }

  const hasContentReturns = [true, false, true, true, false];

  const eliminateEmptyHooks: {
    input: IHasContent[];
    expected: {
      count: number;
    }
  }[] = [
      { input: [], expected: { count: 0 } },
      { input: hasContentReturns.map(v => ({ hasContent: jest.fn(() => v) })), expected: { count: hasContentReturns.filter(r => r).length } },
    ];

  for (const { input, expected } of eliminateEmptyHooks) {
    it(`Should be able to get response with eliminateEmptyHooks(hooks)`, () => {
      const actual = Helper.eliminateEmptyHooks(input);

      expect(actual).toHaveLength(expected.count);

      input.forEach((hook, i) => {
        expect(hook.hasContent).toHaveBeenCalledTimes(1);
        expect(hook.hasContent).toHaveReturnedWith(hasContentReturns[i]);
      });
    });
  }

  const splitIntoCharacters: {
    input: string;
    expected: string[]
  }[] = [
      { input: 'Text', expected: ['T', 'e', 'x', 't'] },
      { input: 'Happy New Year', expected: ['H', 'a', 'p', 'p', 'y', ' ', 'N', 'e', 'w', ' ', 'Y', 'e', 'a', 'r'] },
      { input: '', expected: [] },
    ];

  for (const { input, expected } of splitIntoCharacters) {
    it(`Should be able to get response with splitIntoCharacters(${input})`, () => {
      const actual = Helper.splitIntoCharacters(input);

      expect(actual).toEqual(expected);
    });
  }

  const escapeChars: {
    input: string[];
    expected: string[]
  }[] = [
      { input: ['<', 's', 'c', 'r', 'i', 'p', 't', ' ', '/', '>'], expected: ['&lt;', 's', 'c', 'r', 'i', 'p', 't', ' ', '/', '&gt;'] },
      { input: [], expected: [] },
    ];

  for (const { input, expected } of escapeChars) {
    it(`Should be able to get response with escapeChars(${JSON.stringify(input)})`, () => {
      const actual = Helper.escapeChars(input);

      expect(actual).toEqual(expected);
    });
  }

  const generateHashCode: {
    input: string;
  }[] = [
      { input: 'Can I get a hash?' },
      { input: '' },
    ];

  for (const { input } of generateHashCode) {
    it(`Should be able to get response with generateHashCode(${input})`, () => {
      const actual = Helper.generateHashCode(input);

      expect(actual).toHaveLength(64);
    });
  }

  it(`Should be able to get response with generateRandomNumber()`, () => {
    const actual1 = Helper.generateRandomNumber();
    const actual2 = Helper.generateRandomNumber();

    expect(actual1.length).toBeGreaterThan(5);
    expect(actual2.length).toBeGreaterThan(5);
    expect(actual1).not.toEqual(actual2);
  });
});
