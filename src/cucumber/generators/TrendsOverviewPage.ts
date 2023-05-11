import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { Trends } from '../Trends';
import { AbstractPage } from './AbstractPage';

export class TrendsOverviewPage extends AbstractPage {
  public static readonly WEB_PAGE = 'overview-trends.html';

  constructor(
    reportResult: ReportResult,
    configuration: Configuration,
    private readonly trends: Trends
  ) {
    super(reportResult, 'overviewTrends.ejs', configuration);
  }

  public getWebPage(): string {
    return TrendsOverviewPage.WEB_PAGE;
  }

  public prepareReport(): void {
    this.context.buildNumbers = this.trends.buildNumbers;
    this.context.failedFeatures = this.trends.failedFeatures;
    this.context.passedFeatures = this.trends.passedFeatures;
    this.context.failedScenarios = this.trends.failedScenarios;
    this.context.passedScenarios = this.trends.passedScenarios;
    this.context.passedSteps = this.trends.passedSteps;
    this.context.failedSteps = this.trends.failedSteps;
    this.context.skippedSteps = this.trends.skippedSteps;
    this.context.pendingSteps = this.trends.pendingSteps;
    this.context.undefinedSteps = this.trends.undefinedSteps;
    this.context.durations = this.trends.durations;
  }
}
