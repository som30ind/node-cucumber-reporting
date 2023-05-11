import { render } from 'ejs';
import { outputFileSync } from 'fs-extra';
import { readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { Counter } from '../helpers/Counter';
import { Helper } from '../helpers/Helper';
import { StepHelper } from '../helpers/StepHelper';

export abstract class AbstractPage {
  protected context: Record<string, any> = {};

  protected constructor(
    /**
     * Results of the report.
     */
    protected readonly reportResult: ReportResult,
    /**
     * Name of the HTML file which will be generated.
     */
    private readonly templateFileName: string,
    /**
     * Configuration used for this report execution.
     */
    protected readonly configuration: Configuration
  ) {
    this.buildGeneralParameters();
  }

  public generatePage(): void {
    this.prepareReport();
    this.generateReport();
  }

  /**
   * Returns HTML file name (with extension) for this report.
   *
   * @return HTML file for the report
   */
  public abstract getWebPage(): string;

  protected abstract prepareReport(): void;

  private generateReport(): void {
    const templateRoot = join(this.configuration.resources.sourceDir, `templates`);

    const template = readFileSync(join(templateRoot, 'generators', this.templateFileName), 'utf8');
    this.context.report_file = this.getWebPage();
    // Compile the template and get the rendered HTML as a string
    const html = render(template, this.context, {
      root: [
        templateRoot
      ]
    });

    const reportFile = join(this.configuration.reportDir, this.context.report_file);
    outputFileSync(reportFile, html);
  }

  private buildGeneralParameters(): void {
    // to provide unique ids for elements on each page
    this.context.counter = new Counter();
    this.context.Helper = Helper;
    this.context.stepNameFormatter = StepHelper;
    // this.context.lodash = {
    //   capitalize
    // };

    // Initialize Properties
    // this.context.classifications = undefined;
    // this.context.parallel_testing = false;

    this.context.run_with_jenkins = this.configuration.containsPresentationMode('RUN_WITH_JENKINS');
    this.context.expand_all_steps = this.configuration.containsPresentationMode('EXPAND_ALL_STEPS');
    this.context.hide_empty_hooks = this.configuration.containsReducingMethod('HIDE_EMPTY_HOOKS');
    this.context.trends_available = this.configuration.isTrendsAvailable;
    this.context.build_project_name = this.configuration.projectName;
    this.context.build_number = this.configuration.buildNumber;
    this.context.js_files = this.configuration.customJsFiles.map(jsf => basename(jsf));
    this.context.css_files = this.configuration.customCssFiles.map(cssf => basename(cssf));

    // if report generation fails then report is null
    const formattedTime = this.reportResult != null ? this.reportResult.getBuildTime() : ReportResult.getCurrentTime();
    this.context.build_time = formattedTime;

    // build number is not mandatory
    const buildNumber = +this.configuration.buildNumber;
    this.context.build_previous_number = 0;

    if (buildNumber > 0 && this.configuration.containsPresentationMode('RUN_WITH_JENKINS')) {
      if (Number.isInteger(buildNumber)) {
        this.context.build_previous_number = +buildNumber - 1;
      } else {
        console.info(`Could not parse build number: ${this.configuration.buildNumber}`);
      }
    }
  }
}
