import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { TagObject } from '../json/support/TagObject';
import { AbstractPage } from './AbstractPage';

export class TagReportPage extends AbstractPage {
  constructor(
    reportResult: ReportResult,
    configuration: Configuration,
    private readonly tagObject: TagObject
  ) {
    super(reportResult, 'reportTag.ejs', configuration);
  }

  public getWebPage(): string {
    return this.tagObject.reportFileName;
  }

  public prepareReport(): void {
    this.context.tag = this.tagObject;
  }
}
