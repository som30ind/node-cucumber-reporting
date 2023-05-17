import { describe, expect, it, jest } from '@jest/globals';
import { handleException } from '../../test-helpers/test.helper';
import { IComment } from '../../types/report.type';
import { InvalidDataException, JsonParseException } from '../../types/utility.type';
import { Configuration } from '../Configuration';
import { MComment } from './Comment';

describe('MComment', () => {
  jest.mock('../Configuration');

  const conf = new Configuration();
  const fromJsonCase: {
    input: IComment;
    expected: {
      value?: string;
      line?: number;
      exception?: unknown;
    };
  }[] = [
      {
        input: undefined as unknown as IComment,
        expected: {
          exception: JsonParseException
        }
      },
      {
        input: {
          value: 0 as unknown as string,
          line: '0' as unknown as number
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          value: 0 as unknown as string,
          line: 120
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          value: 'My Value',
          line: '0' as unknown as number
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {} as IComment,
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          value: 'My Value',
          line: 230
        },
        expected: {
          value: 'My Value',
          line: 230
        }
      },
    ];

  for (const { input, expected } of fromJsonCase) {
    it(`Should perform validation of MComment.fromJson(${JSON.stringify(input)})`, () => {
      const fromJson = MComment.fromJson.bind(MComment, conf, input) as () => MComment;

      if (expected.exception) {
        expect(handleException(fromJson)).toBeInstanceOf(expected.exception);
      } else {
        const so = fromJson();
        expect(so.value).toEqual(expected.value);
        expect(so.line).toEqual(expected.line);
      }
    });
  }
});
