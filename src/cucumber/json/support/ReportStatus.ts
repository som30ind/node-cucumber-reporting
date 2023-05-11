import { capitalize } from 'lodash';
import { Status } from '../../../types/report.type';


export class ReportStatus {
  private static readonly UNKNOWN_STATUSES = ['AMBIGUOUS'];
  public readonly value: Status;
  private readonly pLabel: string;
  private readonly pIsPassed: boolean;

  constructor(
    value: Status
  ) {
    this.value = ReportStatus.validatedStatus(value);
    this.pLabel = capitalize(value);
    this.pIsPassed = value === 'PASSED';
  }

  public static validatedStatus(value: Status): Status {
    if (ReportStatus.UNKNOWN_STATUSES.includes(value.toUpperCase())) {
      return 'UNDEFINED';
    }

    return value;
  }

  /**
   * Returns name of the status converted to lower case characters.
   * @return status name as lowercase
   */
  public get rawName(): string {
    return this.value.toLowerCase();
  }

  /**
   * Returns name of the status formatted with first letter to uppercase and lowercase others.
   *
   * @return status formatted with first letter to uppercase
   */
  public get label(): string {
    return this.pLabel;
  }

  /**
   * Returns true if status is equal to {@link #PASSED}.
   *
   * @return <code>true</code> if the status is <code>PASSED</code>, otherwise <code>false</code>
   */
  public get isPassed(): boolean {
    return this.pIsPassed;
  }
}
