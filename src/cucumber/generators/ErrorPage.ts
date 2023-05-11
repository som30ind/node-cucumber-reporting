import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { AbstractPage } from './AbstractPage';

export class ErrorPage extends AbstractPage {
  constructor(
    reportResult: ReportResult,
    configuration: Configuration,
    private readonly exception: any,
    private readonly jsonFiles: string[]
  ) {
    super(reportResult, 'errorpage.ejs', configuration);
    this.exception = exception;
    this.jsonFiles = jsonFiles;
  }

  public getWebPage(): string {
    return Configuration.HOME_PAGE;
  }

  public prepareReport(): void {
    this.context.classifications = this.configuration.classifications;
    this.context.output_message = this.exception instanceof Error ? this.exception.stack ?? this.exception.message : '';
    this.context.json_files = this.jsonFiles;
  }
}
