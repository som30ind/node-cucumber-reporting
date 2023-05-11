import { Reportable } from './Reportable';
import { ReportStatus } from './json/support/ReportStatus';

export class EmptyReportable implements Reportable {
  public getName(): string {
    return '';
  }

  public getFeatures(): number {
    return 0;
  }

  public getPassedFeatures(): number {
    return 0;
  }

  public getFailedFeatures(): number {
    return 0;
  }

  public getScenarios(): number {
    return 0;
  }

  public getPassedScenarios(): number {
    return 0;
  }

  public getFailedScenarios(): number {
    return 0;
  }

  public getSteps(): number {
    return 0;
  }

  public getPassedSteps(): number {
    return 0;
  }

  public getFailedSteps(): number {
    return 0;
  }

  public getSkippedSteps(): number {
    return 0;
  }

  public getUndefinedSteps(): number {
    return 0;
  }

  public getPendingSteps(): number {
    return 0;
  }

  public getDuration(): number {
    return 0;
  }

  public getFormattedDuration(): string {
    return '';
  }

  public getStatus(): ReportStatus {
    return new ReportStatus('UNDEFINED');
  }
}
