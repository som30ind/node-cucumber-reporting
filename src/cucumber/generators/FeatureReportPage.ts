import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { MFeature } from '../json/Feature';
import { AbstractPage } from './AbstractPage';

export class FeatureReportPage extends AbstractPage {
  public constructor(
    reportResult: ReportResult,
    configuration: Configuration,
    private readonly feature: MFeature
  ) {
    super(reportResult, 'reportFeature.ejs', configuration);
  }

  public getWebPage(): string {
    return this.feature.reportFileName;
  }

  public prepareReport(): void {
    this.context.feature = this.feature;
  }
}
