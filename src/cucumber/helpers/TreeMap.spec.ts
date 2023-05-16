import { describe, expect, it } from '@jest/globals';

import { TreeMap } from './TreeMap';

describe('TreeMap', () => {
  const treeMapSize: {
    input: {
      key: string;
      value: string;
    }[];
    expected: number;
  }[] = [
      {
        input: [],
        expected: 0
      },
      {
        input: [
          { key: 'A', value: 'AA' },
          { key: 'B', value: 'BB' },
          { key: 'C', value: 'CC' },
          { key: 'D', value: 'DD' },
          { key: 'E', value: 'EE' },
        ],
        expected: 5
      },
      {
        input: [
          { key: 'E', value: 'EE' },
          { key: 'B', value: 'BB' },
          { key: 'C', value: 'CC' },
          { key: 'A', value: 'AA' },
          { key: 'C', value: 'ZZ' },
          { key: 'D', value: 'DD' },
        ],
        expected: 5
      },
    ];

  for (const { input, expected } of treeMapSize) {
    it(`Should be able to get TreeMap.size: ${JSON.stringify(input)}`, () => {
      const m = new TreeMap<string, string>();

      for (const { key, value } of input) {
        m.put(key, value);
      }

      expect(m.size).toEqual(expected);
    });
  }

  const treeMapGet: {
    input: {
      key: string;
      value: string;
    }[];
    expected: {
      key: string;
      value: string | undefined;
    };
  }[] = [
      {
        input: [],
        expected: { key: 'C', value: undefined }
      },
      {
        input: [
          { key: 'A', value: 'AA' },
          { key: 'B', value: 'BB' },
          { key: 'C', value: 'CC' },
          { key: 'D', value: 'DD' },
          { key: 'E', value: 'EE' },
        ],
        expected: { key: 'C', value: 'CC' }
      },
      {
        input: [
          { key: 'E', value: 'EE' },
          { key: 'B', value: 'BB' },
          { key: 'C', value: 'CC' },
          { key: 'A', value: 'AA' },
          { key: 'C', value: 'ZZ' },
          { key: 'D', value: 'DD' },
        ],
        expected: { key: 'C', value: 'ZZ' }
      },
    ];

  for (const { input, expected } of treeMapGet) {
    it(`Should be able to get TreeMap.get: ${JSON.stringify(input)}`, () => {
      const m = new TreeMap<string, string>();

      for (const { key, value } of input) {
        m.put(key, value);
      }

      expect(m.get(expected.key)).toEqual(expected.value);
    });
  }

  const treeMapValues: {
    input: {
      key: string;
      value: string;
    }[];
    expected: string[];
  }[] = [
      {
        input: [],
        expected: []
      },
      {
        input: [
          { key: 'A', value: 'AA' },
          { key: 'B', value: 'BB' },
          { key: 'C', value: 'CC' },
          { key: 'D', value: 'DD' },
          { key: 'E', value: 'EE' },
        ],
        expected: ['AA', 'BB', 'CC', 'DD', 'EE']
      },
      {
        input: [
          { key: 'E', value: 'EE' },
          { key: 'B', value: 'BB' },
          { key: 'C', value: 'CC' },
          { key: 'A', value: 'AA' },
          { key: 'C', value: 'ZZ' },
          { key: 'D', value: 'DD' },
        ],
        expected: ['AA', 'BB', 'ZZ', 'DD', 'EE']
      },
    ];

  for (const { input, expected } of treeMapValues) {
    it(`Should be able to get TreeMap.values: ${JSON.stringify(input)}`, () => {
      const m = new TreeMap<string, string>();

      for (const { key, value } of input) {
        m.put(key, value);
      }

      expect(m.values()).toEqual(expected);
    });
  }
});
