import { describe, expect, it } from '@jest/globals';

import { IArg } from '../../types/report.type';
import { StepHelper } from './StepHelper';

describe('StepHelper', () => {
  const format: {
    input: {
      stepName: string;
      args: IArg[];
      preArgument: string;
      postArgument: string;
    };
    expected: string;
  }[] = [
      {
        input: {
          stepName: 'I have a new credit card',
          args: [],
          preArgument: `<span class="argument">`,
          postArgument: `</span>`
        },
        expected: 'I have a new credit card'
      },
      {
        input: {
          stepName: 'the Account Holder requests 10, entering PIN 1234',
          args: [
            {
              val: '10',
              offset: 28
            },
            {
              val: '1234',
              offset: 45
            }
          ],
          preArgument: `<span class="argument">`,
          postArgument: `</span>`
        },
        expected: `the Account Holder requests <span class="argument">10</span>, entering PIN <span class="argument">1234</span>`
      },
      {
        input: {
          stepName: 'the Account Holder requests 10, entering PIN 1234',
          args: [
            {
              offset: 28
            },
            {
              val: '1234',
              offset: 45
            }
          ],
          preArgument: `<span class="argument">`,
          postArgument: `</span>`
        },
        expected: `the Account Holder requests 10, entering PIN <span class="argument">1234</span>`
      },
      {
        input: {
          stepName: 'the Account Holder requests 10, entering PIN 1234',
          args: [
            {
              val: '10',
              offset: 28
            },
            {
              offset: 45
            }
          ],
          preArgument: `<span class="argument">`,
          postArgument: `</span>`
        },
        expected: `the Account Holder requests <span class="argument">10</span>, entering PIN 1234`
      },
    ];

  for (const { input, expected } of format) {
    it(`Should be able to get response with format(${input.stepName}, ${JSON.stringify(input.args)}, ${input.preArgument}, ${input.postArgument})`, () => {
      const actual = StepHelper.format(input.stepName, input.args, input.preArgument, input.postArgument);

      expect(actual).toEqual(expected);
    });
  }
});
