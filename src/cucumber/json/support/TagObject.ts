import { Status } from '../../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, NotImplementedException } from '../../../types/utility.type';
import { Reportable } from '../../Reportable';
import { Helper } from '../../helpers/Helper';
import { MElement } from '../../json/Element';
import { MTag } from '../../json/Tag';
import { ReportStatus } from './ReportStatus';
import { StatusCounter } from './StatusCounter';

export class TagObject implements Reportable {
  private readonly pElements: MElement[] = [];

  public readonly reportFileName: string;
  private scenarioCounter: number = 0;
  private readonly elementsStatusCounter = new StatusCounter();
  private readonly stepsStatusCounter = new StatusCounter();
  private totalDuration: number = 0;
  private totalSteps: number = 0;

  /** Default status for current tag: {@link Status#PASSED} if all elements pass {@link Status#FAILED} otherwise. */
  private status: ReportStatus = new ReportStatus('PASSED');

  constructor(
    public readonly tagName: string
  ) {
    if (!tagName) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `TagName cannot be empty!`);
    }

    this.reportFileName = MTag.generateFileName(tagName);
  }

  public addElement(element: MElement): boolean {
    this.pElements.push(element);

    if (this.status.value !== 'FAILED' && element.getStatus().value !== 'PASSED') {
      this.status = new ReportStatus('FAILED');
    }

    if (element.isScenario()) {
      this.scenarioCounter++;
    }

    this.elementsStatusCounter.incrementFor(element.getStatus());

    for (const step of element.steps) {
      this.stepsStatusCounter.incrementFor(step.getResult().status);
      this.totalDuration += step.getDuration();
      this.totalSteps++;
    }

    return true;
  }

  public get elements() {
    return this.pElements;
  }

  public getFeatures(): number {
    throw new NotImplementedException();
  }

  public getPassedFeatures(): number {
    throw new NotImplementedException();
  }

  public getFailedFeatures(): number {
    throw new NotImplementedException();
  }

  public getScenarios(): number {
    return this.scenarioCounter;
  }

  public getPassedScenarios(): number {
    return this.elementsStatusCounter.getValueFor('PASSED');
  }

  public getFailedScenarios(): number {
    return this.elementsStatusCounter.getValueFor('FAILED');
  }

  public getDuration(): number {
    return this.totalDuration;
  }

  public getFormattedDuration(): string {
    return Helper.formatDuration(this.getDuration());
  }

  public getSteps(): number {
    return this.totalSteps;
  }

  public getNumberOfStatus(status: Status): number {
    return this.stepsStatusCounter.getValueFor(status);
  }

  public getPassedSteps(): number {
    return this.getNumberOfStatus('PASSED');
  }

  public getFailedSteps(): number {
    return this.getNumberOfStatus('FAILED');
  }

  public getSkippedSteps(): number {
    return this.getNumberOfStatus('SKIPPED');
  }

  public getUndefinedSteps(): number {
    return this.getNumberOfStatus('UNDEFINED');
  }

  public getPendingSteps(): number {
    return this.getNumberOfStatus('PENDING');
  }

  public getStatus(): ReportStatus {
    return this.status;
  }

  public getRawStatus(): string {
    return this.status.rawName;
  }

  public getName(): string {
    return this.tagName;
  }
}
