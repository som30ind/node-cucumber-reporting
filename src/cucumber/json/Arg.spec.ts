import { describe, expect, it, jest } from '@jest/globals';
import { genStrArray, handleException } from '../../test-helpers/test.helper';
import { IArg } from '../../types/report.type';
import { InvalidDataException, JsonParseException } from '../../types/utility.type';
import { Configuration } from '../Configuration';
import { MArg } from './Arg';
import { MRow } from './Row';

describe('MArg', () => {
  jest.mock('../Configuration');
  jest.mock('../helpers/Helper');
  jest.mock('./Row');
  jest.spyOn(MRow, 'fromJson')
    .mockImplementation((_, jsonData) => ({ cells: jsonData.cells, line: jsonData.line }));

  const rows = [genStrArray('A', 5), genStrArray('AB', 3), genStrArray('C', 7)];
  const conf = new Configuration();
  const fromJsonCase: {
    input: IArg;
    expected: {
      rows?: MRow[];
      val?: string;
      offset?: number;
      exception?: unknown;
    };
  }[] = [
      {
        input: undefined as unknown as IArg,
        expected: {
          exception: JsonParseException
        }
      },
      {
        input: {
          val: 0 as unknown as string
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          offset: '0' as unknown as number
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {},
        expected: {
          offset: 0,
          rows: []
        }
      },
      {
        input: {
          val: 'Argument 1'
        },
        expected: {
          val: 'Argument 1',
          offset: 0,
          rows: []
        }
      },
      {
        input: {
          offset: 250
        },
        expected: {
          offset: 250,
          rows: []
        }
      },
      {
        input: {
          rows: rows.map(r => ({ cells: r })),
        },
        expected: {
          offset: 0,
          rows: rows.map(r => ({ cells: r })),
        }
      },
      {
        input: {
          offset: 125,
          val: 'Argument 1',
          rows: rows.map(r => ({ cells: r })),
        },
        expected: {
          offset: 125,
          val: 'Argument 1',
          rows: rows.map(r => ({ cells: r })),
        }
      },
    ];

  for (const { input, expected } of fromJsonCase) {
    it(`Should perform validation of MArg.fromJson(${JSON.stringify(input)})`, () => {
      const fromJson = MArg.fromJson.bind(MArg, conf, input) as () => MArg;

      if (expected.exception) {
        expect(handleException(fromJson)).toBeInstanceOf(expected.exception);
      } else {
        const so = fromJson();
        expect(so.rows).toEqual(expected.rows);
        expect(so.val).toEqual(expected.val);
        expect(so.offset).toEqual(expected.offset);
      }
    });
  }
});
