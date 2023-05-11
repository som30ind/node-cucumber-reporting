import { allowedStatus } from '../../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode } from '../../../types/utility.type';
import { Helper } from '../../helpers/Helper';
import { ReportStatus } from './ReportStatus';
import { StatusCounter } from './StatusCounter';

export class StepObject {
  /** Time that was spend to execute all occurrence of this step. */
  private totalDuration: number = 0;

  /** How many times this step was executed. */
  private totalOccurrences: number = 0;

  /**
   * Max occured duration for the step.
   */
  private maxDuration: number = 0;

  private readonly statusCounter = new StatusCounter();

  constructor(
    public readonly location: string
  ) {
    if (!location) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, 'Location cannnot be undefined!');
    }
  }

  public addDuration(duration: number, status: ReportStatus): void {
    this.totalDuration += duration;
    this.totalOccurrences++;
    this.statusCounter.incrementFor(status);

    if (duration > this.maxDuration) {
      this.maxDuration = duration;
    }
  }

  public getDuration(): number {
    return this.totalDuration;
  }

  public getFormattedTotalDuration(): string {
    return Helper.formatDuration(this.totalDuration);
  }

  public getAverageDuration(): number {
    return this.totalDuration / this.totalOccurrences;
  }

  public getFormattedAverageDuration(): string {
    return Helper.formatDuration(this.getAverageDuration());
  }

  public getTotalOccurrences(): number {
    return this.totalOccurrences;
  }

  public getMaxDuration(): number {
    return this.maxDuration;
  }

  public getFormattedMaxDuration(): string {
    return Helper.formatDuration(this.maxDuration);
  }

  /**
   * Gets percentage how many steps passed (PASSED / All) formatted to double decimal precision.
   *
   * @return percentage of passed statuses
   */
  public getPercentageResult(): string {
    let total = 0;

    for (const status of allowedStatus) {
      total += this.statusCounter.getValueFor(status);
    }

    return Helper.formatAsPercentage(this.statusCounter.getValueFor('PASSED'), total);
  }

  public getStatus(): ReportStatus {
    return this.statusCounter.finalStatus;
  }
}
