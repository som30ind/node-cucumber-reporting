import { describe, expect, it, jest } from '@jest/globals';
import { parseISO } from 'date-fns';
import { handleException } from '../../test-helpers/test.helper';
import { IElement, IStep, Status } from '../../types/report.type';
import { InvalidDataException, JsonParseException } from '../../types/utility.type';
import { Configuration } from '../Configuration';
import { MElement } from './Element';
import { MHook } from './Hook';
import { MStep } from './Step';
import { MTag } from './Tag';
import { MFeature } from './Feature';
import { IFeatureable } from './support/IFeatureable';
import { ReportStatus } from './support/ReportStatus';

interface IExpectedException {
  $type: 'E';
  exception: unknown;
}

interface IExpectedResult {
  $type: 'R';
  type: string;
  keyword: string;
  steps: boolean[];
  before: boolean[];
  after: boolean[];
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  line: number | undefined;
  // start_timestamp
  startTimestamp: Date | undefined;
  tags: boolean[];

  status: Status;
  beforeStatus: Status;
  afterStatus: Status;
  stepsStatus: Status;
  isScenario: boolean;
  isBackground: boolean;
  duration: number;
  formattedDuration: string;
}

describe('MElement', () => {
  jest.mock('../Configuration');
  jest.mock('../helpers/Helper');
  jest.mock('./Hook');
  jest.mock('./Step');
  jest.mock('./Tag');
  jest.mock('./support/ReportStatus');
  jest.mock('./support/StatusCounter');

  const conf = new Configuration();
  const fromJsonCase: {
    input: IElement;
    expected: IExpectedException | IExpectedResult;
  }[] = [
      {
        input: undefined as unknown as IElement,
        expected: {
          $type: 'E',
          exception: JsonParseException
        }
      },
      {
        input: {
          description: 0 as unknown as string,
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          steps: [],
          type: 'background',
        },
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 0 as unknown as string,
          keyword: 'Background',
          line: 7,
          steps: [],
          type: 'background',
        },
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 0 as unknown as string,
          line: 7,
          steps: [],
          type: 'background',
        },
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: '237' as unknown as number,
          steps: [],
          type: 'background',
        },
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          steps: undefined as unknown as IStep[],
          type: 'background',
        },
        expected: {
          $type: 'R',
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          type: 'background',
          startTimestamp: undefined,
          id: undefined,
          after: [],
          before: [],
          steps: [],
          tags: [],
          afterStatus: 'UNDEFINED',
          beforeStatus: 'UNDEFINED',
          stepsStatus: 'UNDEFINED',
          status: 'UNDEFINED',
          duration: 0,
          formattedDuration: '00:00:00.000',
          isBackground: true,
          isScenario: false,
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          steps: [],
          type: 0 as unknown as string,
        },
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          steps: [],
          type: 'background',
          id: 234 as unknown as string,
        },
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          steps: [],
          type: 'background',
        },
        expected: {
          $type: 'R',
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          type: 'background',
          startTimestamp: undefined,
          id: undefined,
          after: [],
          before: [],
          steps: [],
          tags: [],
          afterStatus: 'UNDEFINED',
          beforeStatus: 'UNDEFINED',
          stepsStatus: 'UNDEFINED',
          status: 'UNDEFINED',
          duration: 0,
          formattedDuration: '00:00:00.000',
          isBackground: true,
          isScenario: false,
        }
      },
      {
        input: {
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          steps: [
            {
              keyword: 'Given ',
              name: 'This is a Ste Def 1'
            },
            {
              keyword: 'Then ',
              name: 'This is a Ste Def 2'
            }
          ],
          type: 'background',
          after: [
            {
              result: {
                status: 'PASSED'
              }
            },
            {
              result: {
                status: 'PASSED'
              }
            }
          ],
          before: [
            {
              result: {
                status: 'PASSED'
              }
            },
            {
              result: {
                status: 'PASSED'
              }
            },
            {
              result: {
                status: 'PASSED'
              }
            }
          ],
          id: 'random-id-183654',
          start_timestamp: '2019-11-25T13:36:37.562Z',
          tags: [
            {
              line: 258,
              name: '@Result1'
            }
          ],
        },
        expected: {
          $type: 'R',
          description: 'Perfect background',
          name: 'Activate Credit Card',
          keyword: 'Background',
          line: 7,
          type: 'background',
          startTimestamp: parseISO('2019-11-25T13:36:37.562Z'),
          id: 'random-id-183654',
          after: [true, true],
          before: [true, true, true],
          steps: [true, true],
          tags: [true],
          afterStatus: 'UNDEFINED',
          beforeStatus: 'UNDEFINED',
          stepsStatus: 'UNDEFINED',
          status: 'UNDEFINED',
          duration: 0,
          formattedDuration: '00:00:00.000',
          isBackground: true,
          isScenario: false,
        }
      },
      {
        input: {} as IElement,
        expected: {
          $type: 'E',
          exception: InvalidDataException
        }
      },
    ];

  for (const { input, expected } of fromJsonCase) {
    it(`Should perform validation of MElement.fromJson(${JSON.stringify(input)})`, () => {
      const fromJson = MElement.fromJson.bind(MElement, conf, input) as () => MElement;

      if (expected.$type === 'E') {
        expect(handleException(fromJson)).toBeInstanceOf(expected.exception);
      } else {
        const so = fromJson();
        expect(so.after.map(o => o instanceof MHook)).toEqual(expected.after);
        expect(so.before.map(o => o instanceof MHook)).toEqual(expected.before);
        expect(so.description).toEqual(expected.description);
        expect(so.id).toEqual(expected.id);
        expect(so.keyword).toEqual(expected.keyword);
        expect(so.line).toEqual(expected.line);
        expect(so.name).toEqual(expected.name);
        expect(so.startTimestamp).toEqual(expected.startTimestamp);
        expect(so.steps.map(o => o instanceof MStep)).toEqual(expected.steps);
        expect(so.tags.map(o => o instanceof MTag)).toEqual(expected.tags);
        expect(so.type).toEqual(expected.type);

        expect(so.isScenario()).toEqual(expected.isScenario);
        expect(so.isBackground()).toEqual(expected.isBackground);
        expect(so.getStatus()).toEqual(new ReportStatus(expected.status));
        expect(so.getBeforeStatus()).toEqual(new ReportStatus(expected.beforeStatus));
        expect(so.getAfterStatus()).toEqual(new ReportStatus(expected.afterStatus));
        expect(so.getStepsStatus()).toEqual(new ReportStatus(expected.stepsStatus));
        expect(so.getFeature()).toBeUndefined();
        expect(so.getDuration()).toEqual(expected.duration);
        expect(so.getFormattedDuration()).toEqual(expected.formattedDuration);
      }
    });
  }

  const setMetaDataCase: {
    input: {
      element: IElement;
      metaData: {
        feature: IFeatureable,
      }
    };
    expected: Record<'before' | 'after', IExpectedResult>;
  }[] = [
      {
        input: {
          element: {
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            steps: undefined as unknown as IStep[],
            type: 'background',
          },
          metaData: {
            feature: MFeature.fromJson(conf, {
              elements: [],
              id: 'feature-1',
              keyword: 'Feature ',
              name: 'Feature to do something 1',
              uri: 'feature/path',
            })
          }
        },
        expected: {
          before: {
            $type: 'R',
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            type: 'background',
            startTimestamp: undefined,
            id: undefined,
            after: [],
            before: [],
            steps: [],
            tags: [],
            afterStatus: 'UNDEFINED',
            beforeStatus: 'UNDEFINED',
            stepsStatus: 'UNDEFINED',
            status: 'UNDEFINED',
            duration: 0,
            formattedDuration: '00:00:00.000',
            isBackground: true,
            isScenario: false,
          },
          after: {
            $type: 'R',
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            type: 'background',
            startTimestamp: undefined,
            id: undefined,
            after: [],
            before: [],
            steps: [],
            tags: [],
            afterStatus: 'PASSED',
            beforeStatus: 'PASSED',
            stepsStatus: 'PASSED',
            status: 'PASSED',
            duration: 0,
            formattedDuration: '00:00:00.000',
            isBackground: true,
            isScenario: false,
          },
        }
      },
      {
        input: {
          element: {
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            steps: [],
            type: 'background',
          },
          metaData: {
            feature: MFeature.fromJson(conf, {
              elements: [],
              id: 'feature-1',
              keyword: 'Feature ',
              name: 'Feature to do something 1',
              uri: 'feature/path',
            })
          }
        },
        expected: {
          before: {
            $type: 'R',
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            type: 'background',
            startTimestamp: undefined,
            id: undefined,
            after: [],
            before: [],
            steps: [],
            tags: [],
            afterStatus: 'UNDEFINED',
            beforeStatus: 'UNDEFINED',
            stepsStatus: 'UNDEFINED',
            status: 'UNDEFINED',
            duration: 0,
            formattedDuration: '00:00:00.000',
            isBackground: true,
            isScenario: false,
          },
          after: {
            $type: 'R',
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            type: 'background',
            startTimestamp: undefined,
            id: undefined,
            after: [],
            before: [],
            steps: [],
            tags: [],
            afterStatus: 'PASSED',
            beforeStatus: 'PASSED',
            stepsStatus: 'PASSED',
            status: 'PASSED',
            duration: 0,
            formattedDuration: '00:00:00.000',
            isBackground: true,
            isScenario: false,
          }
        }
      },
      {
        input: {
          element: {
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            steps: [
              {
                keyword: 'Given ',
                name: 'This is a Ste Def 1'
              },
              {
                keyword: 'Then ',
                name: 'This is a Ste Def 2'
              }
            ],
            type: 'background',
            after: [
              {
                result: {
                  status: 'PASSED'
                }
              },
              {
                result: {
                  status: 'PASSED'
                }
              }
            ],
            before: [
              {
                result: {
                  status: 'PASSED'
                }
              },
              {
                result: {
                  status: 'PASSED'
                }
              },
              {
                result: {
                  status: 'PASSED'
                }
              }
            ],
            id: 'random-id-183654',
            start_timestamp: '2019-11-25T13:36:37.562Z',
            tags: [
              {
                line: 258,
                name: '@Result1'
              }
            ],
          },
          metaData: {
            feature: MFeature.fromJson(conf, {
              elements: [],
              id: 'feature-1',
              keyword: 'Feature ',
              name: 'Feature to do something 1',
              uri: 'feature/path',
            })
          }
        },
        expected: {
          before: {
            $type: 'R',
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            type: 'background',
            startTimestamp: parseISO('2019-11-25T13:36:37.562Z'),
            id: 'random-id-183654',
            after: [true, true],
            before: [true, true, true],
            steps: [true, true],
            tags: [true],
            afterStatus: 'UNDEFINED',
            beforeStatus: 'UNDEFINED',
            stepsStatus: 'UNDEFINED',
            status: 'UNDEFINED',
            duration: 0,
            formattedDuration: '00:00:00.000',
            isBackground: true,
            isScenario: false,
          },
          after: {
            $type: 'R',
            description: 'Perfect background',
            name: 'Activate Credit Card',
            keyword: 'Background',
            line: 7,
            type: 'background',
            startTimestamp: parseISO('2019-11-25T13:36:37.562Z'),
            id: 'random-id-183654',
            after: [true, true],
            before: [true, true, true],
            steps: [true, true],
            tags: [true],
            afterStatus: 'PASSED',
            beforeStatus: 'PASSED',
            stepsStatus: 'FAILED',
            status: 'FAILED',
            duration: 0,
            formattedDuration: '00:00:00.000',
            isBackground: true,
            isScenario: false,
          }
        }
      },
    ];

  for (const { input, expected: { before, after } } of setMetaDataCase) {
    it(`Should perform validation of MElement.setMetaData(${JSON.stringify(input)})`, () => {
      const fromJson = MElement.fromJson.bind(MElement, conf, input.element) as () => MElement;

      const so = fromJson();
      expect(so.after.map(o => o instanceof MHook)).toEqual(before.after);
      expect(so.before.map(o => o instanceof MHook)).toEqual(before.before);
      expect(so.description).toEqual(before.description);
      expect(so.id).toEqual(before.id);
      expect(so.keyword).toEqual(before.keyword);
      expect(so.line).toEqual(before.line);
      expect(so.name).toEqual(before.name);
      expect(so.startTimestamp).toEqual(before.startTimestamp);
      expect(so.steps.map(o => o instanceof MStep)).toEqual(before.steps);
      expect(so.tags.map(o => o instanceof MTag)).toEqual(before.tags);
      expect(so.type).toEqual(before.type);

      expect(so.isScenario()).toEqual(before.isScenario);
      expect(so.isBackground()).toEqual(before.isBackground);
      expect(so.getStatus()).toEqual(new ReportStatus(before.status));
      expect(so.getBeforeStatus()).toEqual(new ReportStatus(before.beforeStatus));
      expect(so.getAfterStatus()).toEqual(new ReportStatus(before.afterStatus));
      expect(so.getStepsStatus()).toEqual(new ReportStatus(before.stepsStatus));
      expect(so.getFeature()).toBeUndefined();
      expect(so.getDuration()).toEqual(before.duration);
      expect(so.getFormattedDuration()).toEqual(before.formattedDuration);

      so.setMetaData(input.metaData.feature, conf);

      expect(so.after.map(o => o instanceof MHook)).toEqual(after.after);
      expect(so.before.map(o => o instanceof MHook)).toEqual(after.before);
      expect(so.description).toEqual(after.description);
      expect(so.id).toEqual(after.id);
      expect(so.keyword).toEqual(after.keyword);
      expect(so.line).toEqual(after.line);
      expect(so.name).toEqual(after.name);
      expect(so.startTimestamp).toEqual(after.startTimestamp);
      expect(so.steps.map(o => o instanceof MStep)).toEqual(after.steps);
      expect(so.tags.map(o => o instanceof MTag)).toEqual(after.tags);
      expect(so.type).toEqual(after.type);

      expect(so.isScenario()).toEqual(after.isScenario);
      expect(so.isBackground()).toEqual(after.isBackground);
      expect(so.getStatus()).toEqual(new ReportStatus(after.status));
      expect(so.getBeforeStatus()).toEqual(new ReportStatus(after.beforeStatus));
      expect(so.getAfterStatus()).toEqual(new ReportStatus(after.afterStatus));
      expect(so.getStepsStatus()).toEqual(new ReportStatus(after.stepsStatus));
      expect(so.getFeature() instanceof MFeature).toEqual(true);
      expect(so.getDuration()).toEqual(after.duration);
      expect(so.getFormattedDuration()).toEqual(after.formattedDuration);
    });
  }
});
