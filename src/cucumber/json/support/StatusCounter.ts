import { Status, allowedStatus } from '../../../types/report.type';
import { ReportStatus } from './ReportStatus';
import { Resultsable } from './Resultable';

export class StatusCounter {
  private readonly counter: Record<Status, number> = {} as Record<Status, number>;

  /**
   * Is equal to {@link Status#FAILED} when at least counted status is not {@link Status#PASSED},
   * otherwise set to {@link Status#PASSED}.
   */
  private pFinalStatus: ReportStatus = new ReportStatus('PASSED');
  private pSize = 0;

  constructor(resultsables: Resultsable[] = [], notFailingStatuses: Status[] = []) {
    for (const status of allowedStatus) {
      this.counter[status] = 0;
    }

    for (const resultsable of resultsables) {
      const status = resultsable.getResult().status;

      if (notFailingStatuses != null && notFailingStatuses.includes(status.value)) {
        this.incrementFor(new ReportStatus('PASSED'));
      } else {
        this.incrementFor(status);
      }
    }
  }

  /**
   * Gets the sum of all occurrences for all statuses.
   *
   * @return sum of all occurrences for all statuses
   */
  public get size() {
    return this.pSize;
  }

  /**
   * If statuses for all items are the same then this finalStatus is returned, otherwise {@link Status#FAILED}.
   *
   * @return final status for this counter
   */
  public get finalStatus() {
    return this.pFinalStatus;
  }

  /**
   * Increments finalStatus counter by single value.
   *
   * @param status
   *            finalStatus for which the counter should be incremented.
   */
  public incrementFor(status: ReportStatus): void {
    const statusCounter: number = this.getValueFor(status.value) + 1;
    this.counter[status.value] = statusCounter;
    this.pSize++;

    if (this.pFinalStatus.isPassed && !status.isPassed) {
      this.pFinalStatus = new ReportStatus('FAILED');
    }
  }

  /**
   * Gets the number of occurrences for given status.
   *
   * @param status the status
   * @return number of occurrences for given status
   */
  public getValueFor(status: Status): number {
    return this.counter[status];
  }
}
