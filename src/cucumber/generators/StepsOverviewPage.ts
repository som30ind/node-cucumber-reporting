import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { Helper } from '../helpers/Helper';
import { StepObject } from '../json/support/StepObject';
import { AbstractPage } from './AbstractPage';

export class StepsOverviewPage extends AbstractPage {
  public static readonly WEB_PAGE = 'overview-steps.html';

  constructor(
    reportResult: ReportResult,
    configuration: Configuration
  ) {
    super(reportResult, 'overviewSteps.ejs', configuration);
  }

  public getWebPage(): string {
    return StepsOverviewPage.WEB_PAGE;
  }

  public prepareReport(): void {
    this.context.all_steps = this.reportResult.getAllSteps();
    let allOccurrences = 0;
    let allDurations = 0;

    for (const stepObject of this.reportResult.getAllSteps()) {
      allOccurrences += stepObject.getTotalOccurrences();
      allDurations += stepObject.getDuration();
    }

    this.context.all_occurrences = allOccurrences;
    this.context.all_durations = Helper.formatDuration(allDurations);
    // make sure it does not divide by 0 - may happens if there is no step at all or all results have 0 ms durations
    this.context.all_max_duration = Helper.formatDuration(this.maxDurationOf(this.reportResult.getAllSteps()));
    const average = allDurations / (allOccurrences == 0 ? 1 : allOccurrences);
    this.context.all_average_duration = Helper.formatDuration(average);
  }

  private maxDurationOf(steps: StepObject[]): number {
    return Math.max(...steps.map(s => s.getDuration()));
  }
}
