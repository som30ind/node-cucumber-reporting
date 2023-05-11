import { NotImplementedException } from '../../types/utility.type';
import { Reportable } from '../Reportable';
import { Helper } from '../helpers/Helper';
import { ReportStatus } from '../json/support/ReportStatus';
import { StatusCounter } from '../json/support/StatusCounter';

export class OverviewReport implements Reportable {
  private duration: number = 0;

  private readonly featuresCounter = new StatusCounter();
  private readonly scenariosCounter = new StatusCounter();
  private readonly stepsCounter = new StatusCounter();

  public incFeaturesFor(status: ReportStatus): void {
    this.featuresCounter.incrementFor(status);
  }

  public getFeatures(): number {
    return this.featuresCounter.size;
  }

  public getPassedFeatures(): number {
    return this.featuresCounter.getValueFor('PASSED');
  }

  public getFailedFeatures(): number {
    return this.featuresCounter.getValueFor('FAILED');
  }

  public incScenarioFor(status: ReportStatus): void {
    this.scenariosCounter.incrementFor(status);
  }

  public getScenarios(): number {
    return this.scenariosCounter.size;
  }

  public getPassedScenarios(): number {
    return this.scenariosCounter.getValueFor('PASSED');
  }

  public getFailedScenarios(): number {
    return this.scenariosCounter.getValueFor('FAILED');
  }

  public incStepsFor(status: ReportStatus): void {
    this.stepsCounter.incrementFor(status);
  }

  public getSteps(): number {
    return this.stepsCounter.size;
  }

  public getPassedSteps(): number {
    return this.stepsCounter.getValueFor('PASSED');
  }

  public getFailedSteps(): number {
    return this.stepsCounter.getValueFor('FAILED');
  }

  public getSkippedSteps(): number {
    return this.stepsCounter.getValueFor('SKIPPED');
  }

  public getUndefinedSteps(): number {
    return this.stepsCounter.getValueFor('UNDEFINED');
  }

  public getPendingSteps(): number {
    return this.stepsCounter.getValueFor('PENDING');
  }

  public incDurationBy(duration: number): void {
    this.duration += duration;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getFormattedDuration(): string {
    return Helper.formatDuration(this.getDuration());
  }

  public getName(): string {
    throw new NotImplementedException();
  }

  public getStatus(): ReportStatus {
    throw new NotImplementedException();
  }
}
