import { zip } from 'lodash';
import { Configuration } from '../Configuration';
import { ReportResult } from '../ReportResult';
import { Helper } from '../helpers/Helper';
import { TagObject } from '../json/support/TagObject';
import { AbstractPage } from './AbstractPage';

export class TagsOverviewPage extends AbstractPage {
  public static readonly WEB_PAGE = 'overview-tags.html';

  constructor(
    reportResult: ReportResult,
    configuration: Configuration
  ) {
    super(reportResult, 'overviewTags.ejs', configuration);
  }

  public getWebPage(): string {
    return TagsOverviewPage.WEB_PAGE;
  }

  public prepareReport(): void {
    const tags = this.reportResult.getAllTags();
    this.context.all_tags = tags;
    this.context.report_summary = this.reportResult.getTagReport();
    this.context.chart_categories = TagsOverviewPage.generateTagLabels(tags);
    this.context.chart_data = TagsOverviewPage.generateTagValues(tags);
  }

  public static generateTagLabels(tagsObjectList: TagObject[]): string[] {
    return tagsObjectList.map(t => t.getName());
  }


  public static generateTagValues(tagsObjectList: TagObject[]): string[][] {
    const values = tagsObjectList.map(t => {
      const allSteps = t.getSteps();

      return [
        Helper.formatAsDecimal(t.getPassedSteps(), allSteps),
        Helper.formatAsDecimal(t.getFailedSteps(), allSteps),
        Helper.formatAsDecimal(t.getSkippedSteps(), allSteps),
        Helper.formatAsDecimal(t.getPendingSteps(), allSteps),
        Helper.formatAsDecimal(t.getUndefinedSteps(), allSteps),
      ];
    });

    return zip(...values) as string[][];
  }
}
