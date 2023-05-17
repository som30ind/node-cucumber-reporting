import { describe, expect, it, jest } from '@jest/globals';

import { handleException } from '../../../test-helpers/test.helper';
import { IElement, Status } from '../../../types/report.type';
import { InvalidDataException, NotImplementedException } from '../../../types/utility.type';
import { Configuration } from '../../Configuration';
import { MElement } from '../Element';
import { MTag } from '../Tag';
import { ReportStatus } from './ReportStatus';
import { TagObject } from './TagObject';

describe('TagObject', () => {
  jest.mock('../../Reportable');
  jest.mock('../../helpers/Helper');
  jest.mock('../../json/Element');
  jest.mock('../../json/Tag');
  jest.mock('./ReportStatus');
  jest.mock('./StatusCounter');

  jest.spyOn(MTag, 'generateFileName')
    .mockImplementation(s => s.replace('@', ''));

  const constructorCase: {
    input: string;
    exceptionThrown: boolean;
  }[] = [
      { input: undefined as unknown as string, exceptionThrown: true },
      { input: '', exceptionThrown: true },
      { input: '@MyTag', exceptionThrown: false },
    ];

  for (const { input, exceptionThrown } of constructorCase) {
    it(`Should be able to create instance with new TagObject(${input})`, () => {
      let exception: any;

      try {
        new TagObject(input);
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

  const conf = new Configuration();

  const addDurationCase: {
    input: {
      tagName: string;
      elements: IElement[];
    };
    expected: {
      tagName: string;
      passedScenarios: number;
      failedScenarios: number;
      duration: number;
      formattedDuration: string;
      steps: number;
      passedSteps: number;
      failedSteps: number;
      skippedSteps: number;
      undefinedSteps: number;
      pendingSteps: number;
      status: Status;
      rawStatus: string;
      numberOfStatus: Record<Status, number>;
      reportFileName: string;
      scenarios: number;
    };
  }[] = [
      {
        input: {
          tagName: '@MyTag',
          elements: []
        },
        expected: {
          tagName: '@MyTag',
          passedScenarios: 0,
          failedScenarios: 0,
          duration: 0,
          formattedDuration: '00:00:00.000',
          steps: 0,
          passedSteps: 0,
          failedSteps: 0,
          skippedSteps: 0,
          undefinedSteps: 0,
          pendingSteps: 0,
          status: 'PASSED',
          rawStatus: 'passed',
          numberOfStatus: {
            AMBIGUOUS: 0,
            FAILED: 0,
            PASSED: 0,
            PENDING: 0,
            SKIPPED: 0,
            UNDEFINED: 0
          },
          reportFileName: 'MyTag',
          scenarios: 0
        }
      },
      {
        input: {
          tagName: '@MyTag',
          elements: [{
            id: 'account-holder-withdraws-more-cash;clean-up',
            name: 'Clean-up',
            keyword: 'Scenario',
            line: 31,
            steps: [
              {
                result: {
                  duration: 560000,
                  status: 'passed' as Status
                },
                name: 'Stream closing',
                keyword: 'Given ',
                line: 32
              }
            ],
            type: 'scenario'
          },
          {
            id: 'undefined-result',
            name: 'This step has no result...',
            keyword: 'Scenario',
            line: 35,
            steps: [
              {
                result: {
                  duration: 846000,
                  status: 'passed' as Status
                },
                name: ' - even it should',
                keyword: 'Given ',
                line: 36
              }
            ],
            type: 'scenario'
          }, {
            id: 'account-holder-withdraws-more-cash;clean-up',
            name: 'Clean-up',
            keyword: 'Scenario',
            line: 31,
            steps: [
              {
                result: {
                  duration: 84236000000,
                  status: 'passed' as Status
                },
                name: 'Stream closing 1',
                keyword: 'Then ',
                line: 32
              }
            ],
            type: 'scenario'
          },]
        },
        expected: {
          tagName: '@MyTag',
          passedScenarios: 0,
          failedScenarios: 0,
          duration: 84237406000,
          formattedDuration: '00:01:24.237',
          steps: 3,
          passedSteps: 3,
          failedSteps: 0,
          skippedSteps: 0,
          undefinedSteps: 0,
          pendingSteps: 0,
          status: 'FAILED',
          rawStatus: 'failed',
          numberOfStatus: {
            AMBIGUOUS: 0,
            FAILED: 0,
            PASSED: 3,
            PENDING: 0,
            SKIPPED: 0,
            UNDEFINED: 0
          },
          reportFileName: 'MyTag',
          scenarios: 3
        }
      },
      {
        input: {
          tagName: '@MyTag',
          elements: [{
            id: 'account-holder-withdraws-more-cash;clean-up',
            name: 'Clean-up',
            keyword: 'Scenario',
            line: 31,
            steps: [
              {
                result: {
                  duration: 560000,
                  status: 'passed' as Status
                },
                name: 'Stream closing',
                keyword: 'Given ',
                line: 32
              }
            ],
            type: 'scenario'
          },
          {
            id: 'undefined-result',
            name: 'This step has no result...',
            keyword: 'Scenario',
            line: 35,
            steps: [
              {
                name: ' - even it should',
                keyword: 'Given ',
                line: 36
              }
            ],
            type: 'scenario'
          }, {
            id: 'account-holder-withdraws-more-cash;clean-up',
            name: 'Clean-up',
            keyword: 'Scenario',
            line: 31,
            steps: [
              {
                result: {
                  duration: 846000,
                  status: 'failed' as Status
                },
                name: 'Stream closing 1',
                keyword: 'Then ',
                line: 32
              }
            ],
            type: 'scenario'
          },]
        },
        expected: {
          tagName: '@MyTag',
          passedScenarios: 0,
          failedScenarios: 0,
          duration: 1406000,
          formattedDuration: '00:00:00.001',
          steps: 3,
          passedSteps: 1,
          failedSteps: 1,
          skippedSteps: 0,
          undefinedSteps: 1,
          pendingSteps: 0,
          status: 'FAILED',
          rawStatus: 'failed',
          numberOfStatus: {
            AMBIGUOUS: 0,
            FAILED: 1,
            PASSED: 1,
            PENDING: 0,
            SKIPPED: 0,
            UNDEFINED: 1
          },
          reportFileName: 'MyTag',
          scenarios: 3
        }
      }
    ];

  for (const { input, expected } of addDurationCase) {
    it(`Should perform validation on TagObject(${input.tagName} with ${JSON.stringify(input.elements)})`, () => {
      const so = new TagObject(input.tagName);

      const expectedElements = input.elements.map(el => {
        const mEl = MElement.fromJson(conf, el);
        so.addElement(mEl);

        return mEl;
      });

      expect(so.tagName).toEqual(expected.tagName);
      expect(so.reportFileName).toEqual(expected.reportFileName);
      expect(so.elements).toEqual(expectedElements);
      expect(handleException(so.getFeatures)).toBeInstanceOf(NotImplementedException);
      expect(handleException(so.getPassedFeatures)).toBeInstanceOf(NotImplementedException);
      expect(handleException(so.getFailedFeatures)).toBeInstanceOf(NotImplementedException);
      expect(so.getPassedScenarios()).toEqual(expected.passedScenarios);
      expect(so.getFailedScenarios()).toEqual(expected.failedScenarios);
      expect(so.getScenarios()).toEqual(expected.scenarios);
      expect(so.getDuration()).toEqual(expected.duration);
      expect(so.getFormattedDuration()).toEqual(expected.formattedDuration);
      expect(so.getSteps()).toEqual(expected.steps);
      expect(so.getPassedSteps()).toEqual(expected.passedSteps);
      expect(so.getFailedSteps()).toEqual(expected.failedSteps);
      expect(so.getSkippedSteps()).toEqual(expected.skippedSteps);
      expect(so.getUndefinedSteps()).toEqual(expected.undefinedSteps);
      expect(so.getPendingSteps()).toEqual(expected.pendingSteps);
      expect(so.getStatus()).toEqual(new ReportStatus(expected.status));
      expect(so.getRawStatus()).toEqual(expected.rawStatus);
      expect(so.getName()).toEqual(expected.tagName);

      (Object.keys(expected.numberOfStatus) as Status[]).forEach(k =>
        expect(so.getNumberOfStatus(k)).toEqual(expected.numberOfStatus[k])
      );
    });
  }
});
