import { ensureDirSync, existsSync, outputJsonSync, readJsonSync } from 'fs-extra';
import { copyFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { Configuration, UserConfiguration } from './Configuration';
import { EmptyReportable } from './EmptyReportable';
import { ReportParser } from './ReportParser';
import { ReportResult } from './ReportResult';
import { Reportable } from './Reportable';
import { Trends } from './Trends';
import { ErrorPage } from './generators/ErrorPage';
import { FailuresOverviewPage } from './generators/FailuresOverviewPage';
import { FeatureReportPage } from './generators/FeatureReportPage';
import { FeaturesOverviewPage } from './generators/FeaturesOverviewPage';
import { StepsOverviewPage } from './generators/StepsOverviewPage';
import { TagReportPage } from './generators/TagReportPage';
import { TagsOverviewPage } from './generators/TagsOverviewPage';
import { TrendsOverviewPage } from './generators/TrendsOverviewPage';

export class ReportBuilder {
  /**
   * Page that should be displayed when the reports is generated. Shared between {@link FeaturesOverviewPage} and
   * {@link ErrorPage}.
   */
  // public static HOME_PAGE = 'overview-features.html';

  private reportResult!: ReportResult;
  private readonly reportParser: ReportParser;
  private readonly configuration: Configuration;

  /**
   * Flag used to detect if the file with updated trends is saved.
   * If the report crashes and the trends was not saved then it tries to save trends again with empty data
   * to mark that the build crashed.
   */
  private wasTrendsFileSaved = false;

  constructor(
    private jsonFiles: string[],
    userConfigs: Partial<UserConfiguration>
  ) {
    this.configuration = new Configuration(userConfigs);
    this.reportParser = new ReportParser(this.configuration);
  }

  /**
   * Parses provided files and generates the report. When generating process fails
   * report with information about error is provided.
   *
   * @return stats for the generated report
   */
  public generateReports(): Reportable | undefined {
    let trends = Trends.defaultObject();

    try {
      // first copy static resources so ErrorPage is displayed properly
      this.copyStaticResources();

      // copy custom js and css resources if specific in configuration
      this.copyCustomJsAndCssResources();

      // create directory for embeddings before files are generated
      this.createEmbeddingsDirectory();

      // add metadata info sourced from files
      this.reportParser.parseClassificationsFiles(this.configuration.classificationFiles);

      // parse json files for results
      const features = this.reportParser.parseJsonFiles(this.jsonFiles);
      this.reportResult = new ReportResult(features, this.configuration);
      const reportable = this.reportResult.getFeatureReport();

      if (this.configuration.isTrendsAvailable) {
        // prepare data required by generators, collect generators and generate pages
        trends = this.updateAndSaveTrends(reportable);
      }

      // Collect and generate pages in a single pass
      this.generatePages(trends);

      return reportable;

      // whatever happens we want to provide at least error page instead of incomplete report or exception
    } catch (e) {
      this.generateErrorPage(e);
      // update trends so there is information in history that the build failed

      // if trends was not created then something went wrong
      // and information about build failure should be saved
      if (!this.wasTrendsFileSaved && this.configuration.isTrendsAvailable) {
        const reportable: Reportable = new EmptyReportable();
        this.updateAndSaveTrends(reportable);
      }

      // something went wrong, don't pass result that might be incomplete
      return;
    }
  }

  private copyCustomJsAndCssResources(): void {
    for (const jsFile of this.configuration.resources.customJsFiles) {
      this.copyCustomResources('js', jsFile);
    }

    for (const cssFile of this.configuration.resources.customCssFiles) {
      this.copyCustomResources('css', cssFile);
    }
  }

  private copyStaticResources(): void {
    this.copyResources('css', 'cucumber.css', 'bootstrap.min.css', 'font-awesome.min.css');
    this.copyResources('js', 'jquery.min.js', 'jquery.tablesorter.min.js', 'bootstrap.min.js', 'Chart.min.js',
      'moment.min.js');
    this.copyResources('fonts', 'FontAwesome.otf', 'fontawesome-webfont.svg', 'fontawesome-webfont.woff',
      'fontawesome-webfont.eot', 'fontawesome-webfont.ttf', 'fontawesome-webfont.woff2',
      'glyphicons-halflings-regular.eot', 'glyphicons-halflings-regular.eot',
      'glyphicons-halflings-regular.woff2', 'glyphicons-halflings-regular.woff',
      'glyphicons-halflings-regular.ttf', 'glyphicons-halflings-regular.svg');
    this.copyResources('images', 'favicon.png');
  }

  private createEmbeddingsDirectory(): void {
    const dir = resolve(this.configuration.reportDir, Configuration.embeddingsDir);
    ensureDirSync(dir);
  }

  private copyResources(resourceLocation: string, ...resources: string[]): void {
    const srcResourcesDir = join(this.configuration.resources.sourceDir, resourceLocation);
    const destResourcesDir = resolve(this.configuration.reportDir, resourceLocation);

    ensureDirSync(destResourcesDir);

    for (const resource of resources) {
      copyFileSync(join(srcResourcesDir, resource), join(destResourcesDir, resource));
    }
  }

  private copyCustomResources(resourceLocation: string, srcFile: string): void {
    const destResourcesDir = resolve(this.configuration.reportDir, resourceLocation);
    copyFileSync(srcFile, join(destResourcesDir, `${basename(srcFile)}`));
  }

  private generatePages(trends: Trends): void {
    new FeaturesOverviewPage(this.reportResult, this.configuration).generatePage();

    for (const feature of this.reportResult.getAllFeatures()) {
      new FeatureReportPage(this.reportResult, this.configuration, feature).generatePage();
    }

    new TagsOverviewPage(this.reportResult, this.configuration).generatePage();

    for (const tagObject of this.reportResult.getAllTags()) {
      new TagReportPage(this.reportResult, this.configuration, tagObject).generatePage();
    }

    new StepsOverviewPage(this.reportResult, this.configuration).generatePage();
    new FailuresOverviewPage(this.reportResult, this.configuration).generatePage();

    if (this.configuration.isTrendsAvailable) {
      new TrendsOverviewPage(this.reportResult, this.configuration, trends).generatePage();
    }
  }

  private updateAndSaveTrends(reportable: Reportable): Trends {
    const trends = this.loadOrCreateTrends();
    this.appendToTrends(trends, reportable);

    // display only last n items - don't skip items if limit is not defined
    if (this.configuration.trendsLimit > 0) {
      trends.limitItems(this.configuration.trendsLimit);
    }

    // save updated trends so it contains history only for the last builds
    if (this.configuration.trends.file) {
      this.saveTrends(trends, this.configuration.trends.file);
    }

    return trends;
  }

  private loadOrCreateTrends(): Trends {
    const trendsFile = this.configuration.trends.file;

    if (trendsFile && existsSync(trendsFile)) {
      return ReportBuilder.loadTrends(trendsFile);
    } else {
      return Trends.defaultObject();
    }
  }

  private static loadTrends(file: string): Trends {
    const jsonData = readJsonSync(file);

    return Trends.fromJson(jsonData);
  }

  private appendToTrends(trends: Trends, result: Reportable): void {
    trends.addBuild(this.configuration.buildNumber, result);
  }

  private saveTrends(trends: Trends, file: string): void {
    outputJsonSync(file, trends.toJson());
    this.wasTrendsFileSaved = true;
  }

  private generateErrorPage(exception: any): void {
    console.warn('Unexpected error', exception);
    const errorPage = new ErrorPage(this.reportResult, this.configuration, exception, this.jsonFiles);
    errorPage.generatePage();
  }
}
