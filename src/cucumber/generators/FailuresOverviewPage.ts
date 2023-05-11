import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { MElement } from '../json/Element';
import { AbstractPage } from './AbstractPage';

export class FailuresOverviewPage extends AbstractPage {
  public static readonly WEB_PAGE = 'overview-failures.html';

  constructor(
    reportResult: ReportResult, configuration: Configuration
  ) {
    super(reportResult, 'overviewFailures.ejs', configuration);
  }

  public getWebPage(): string {
    return FailuresOverviewPage.WEB_PAGE;
  }

  public prepareReport(): void {
    this.context.failures = this.collectFailures();
  }

  private collectFailures(): MElement[] {
    return this.reportResult.getAllFeatures()
      .filter(feature => !feature.getStatus().isPassed)
      .flatMap(feature => feature.elements)
      .filter(element => !element.getStatus().isPassed);
  }
}
