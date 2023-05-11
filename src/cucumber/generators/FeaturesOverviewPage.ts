import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { AbstractPage } from './AbstractPage';

export class FeaturesOverviewPage extends AbstractPage {
  constructor(reportResult: ReportResult, configuration: Configuration) {
    super(reportResult, 'overviewFeatures.ejs', configuration);
  }

  public getWebPage(): string {
    return Configuration.HOME_PAGE;
  }

  public prepareReport(): void {
    this.context.all_features = this.reportResult.getAllFeatures();
    this.context.report_summary = this.reportResult.getFeatureReport();
    this.context.parallel_testing = this.configuration.containsPresentationMode('PARALLEL_TESTING');
    this.context.classifications = this.configuration.classifications;
  }
}
