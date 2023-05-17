import { describe, expect, it, jest } from '@jest/globals';
import { handleException } from '../../test-helpers/test.helper';
import { IDocString } from '../../types/report.type';
import { InvalidDataException, JsonParseException } from '../../types/utility.type';
import { Configuration } from '../Configuration';
import { MDocString } from './DocString';

describe('MDocString', () => {
  jest.mock('../Configuration');
  jest.mock('../helpers/Helper');

  const conf = new Configuration();
  const fromJsonCase: {
    input: IDocString;
    expected: {
      type: 'E';
      exception: unknown;
    } | {
      type: 'R';
      value: string;
      contentType: string;
      line: number;
    };
  }[] = [
      {
        input: undefined as unknown as IDocString,
        expected: {
          type: 'E',
          exception: JsonParseException
        }
      },
      {
        input: {
          value: 0 as unknown as string,
          content_type: 'plain/text',
          line: 235,
        },
        expected: {
          type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          value: 'Some Text',
          content_type: 0 as unknown as string,
          line: 235,
        },
        expected: {
          type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          value: 'Some Text',
          content_type: 'plain/text',
          line: '235' as unknown as number,
        },
        expected: {
          type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          value: 'Some Text',
          content_type: 'plain/text',
          line: 235,
        },
        expected: {
          type: 'R',
          value: 'Some Text',
          contentType: 'plain/text',
          line: 235,
        }
      },
      {
        input: {} as IDocString,
        expected: {
          type: 'E',
          exception: InvalidDataException
        }
      },
    ];

  for (const { input, expected } of fromJsonCase) {
    it(`Should perform validation of MDocString.fromJson(${JSON.stringify(input)})`, () => {
      const fromJson = MDocString.fromJson.bind(MDocString, conf, input) as () => MDocString;

      if (expected.type === 'E') {
        expect(handleException(fromJson)).toBeInstanceOf(expected.exception);
      } else {
        const so = fromJson();
        expect(so.value).toEqual(expected.value);
        expect(so.contentType).toEqual(expected.contentType);
        expect(so.line).toEqual(expected.line);
      }
    });
  }
});
