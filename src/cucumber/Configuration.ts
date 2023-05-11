import { join } from 'node:path';
import { ReducingMethod } from './reducers/ReducingMethod';
import { SortingMethod } from './sorting/SortingMethod';
import { Status } from '../types/report.type';

export class UserConfigurationResources {
  public readonly customJsFiles: string[];
  public readonly customCssFiles: string[];

  constructor(
    userConfig?: Partial<UserConfigurationResources>
  ) {
    userConfig = userConfig ?? {};

    this.customJsFiles = userConfig.customJsFiles ?? [];
    this.customCssFiles = userConfig.customCssFiles ?? [];
  }
}

export interface ConfigurationTrends {
  readonly file?: string;
  readonly limit?: number;
}

export abstract class UserConfiguration {
  public readonly reportDir: string;
  public readonly buildNumber: string;
  public readonly resources: UserConfigurationResources;
  public readonly reducingMethods: ReducingMethod[];
  public readonly qualifiers: Record<string, string>;
  public readonly classificationFiles: string[];
  public readonly notFailingStatuses: Status[];
  public readonly sortingMethod: SortingMethod;
  public readonly presentationModes: PresentationMode[];
  public readonly projectName: string;
  public readonly customJsFiles: string[];
  public readonly customCssFiles: string[];
  public readonly classifications: Record<string, string>;
  public trends: ConfigurationTrends;

  constructor(
    userConfig?: Partial<UserConfiguration>
  ) {
    if (!userConfig) {
      userConfig = {};
    }

    this.reportDir = userConfig.reportDir ?? './reports';
    this.buildNumber = userConfig.buildNumber ?? '';
    this.resources = new UserConfigurationResources(userConfig?.resources);
    this.reducingMethods = userConfig.reducingMethods ?? [];
    this.qualifiers = userConfig.qualifiers ?? {};
    this.classificationFiles = userConfig.classificationFiles ?? [];
    this.notFailingStatuses = userConfig.notFailingStatuses ?? [];
    this.sortingMethod = userConfig.sortingMethod ?? 'NATURAL';
    this.presentationModes = userConfig.presentationModes ?? [];
    this.projectName = userConfig.projectName ?? 'Cucumber Project';
    this.customJsFiles = userConfig.customJsFiles ?? [];
    this.customCssFiles = userConfig.customCssFiles ?? [];
    this.classifications = userConfig.classifications ?? {};
    this.trends = userConfig.trends ?? {};
  }
}

export class ConfigurationResources extends UserConfigurationResources {
  public readonly sourceDir: string = join(__dirname, '../../..', 'resources');

  constructor(
    userConfig?: Partial<UserConfigurationResources>
  ) {
    super(userConfig);
  }
}

export class Configuration extends UserConfiguration {
  public static readonly HOME_PAGE: string = 'overview-features.html';
  public static readonly embeddingsDir: string = 'embeddings';
  public static readonly FILE_EXTENSION_PATTERN = /[a-z0-9]+$/;
  public static readonly UNKNOWN_FILE_EXTENSION = 'unknown';
  public readonly resources: ConfigurationResources;

  constructor(
    userConfig?: Partial<UserConfiguration>
  ) {
    super(userConfig);
    this.resources = new ConfigurationResources(userConfig?.resources);
  }

  public get isTrendsAvailable() {
    return (this.trends.limit ?? -1) > -1 && this.isTrendsStatsFile;
  }

  public get isTrendsStatsFile() {
    return !!this.trends.file;
  }

  public get trendsLimit() {
    return this.trends.limit ?? 0;
  }

  public setTrends(file: string, limit: number): void {
    this.trends = {
      file,
      limit
    };
  }

  public setTrendsStatsFile(file: string): void {
    this.trends = {
      file,
      limit: 0
    };
  }

  public containsPresentationMode(mode: PresentationMode): boolean {
    return this.presentationModes.includes(mode);
  }

  public containsReducingMethod(method: ReducingMethod): boolean {
    return this.reducingMethods.includes(method);
  }
}

export type PresentationMode =
  /**
   * Defines additional menu buttons that enables integration with Jenkins.
   */
  'RUN_WITH_JENKINS' |

  /**
   * Expands all scenarios by default.
   */
  'EXPAND_ALL_STEPS' |

  /**
   * Add "target" column to the report, when running the same tests many times.
   * Value of this column is same as JSON report file name.
   */
  'PARALLEL_TESTING';
