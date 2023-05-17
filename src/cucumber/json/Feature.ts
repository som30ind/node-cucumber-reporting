import { isPlainObject, isString, toInteger } from 'lodash';
import { Configuration } from '../Configuration';
import { IFeature } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MElement } from './Element';
import { MTag } from './Tag';
import { IFeatureable } from './support/IFeatureable';
import { ReportStatus } from './support/ReportStatus';
import { StatusCounter } from './support/StatusCounter';

export class MFeature implements IFeatureable {
  public reportFileName!: string;
  public qualifier!: string;

  private scenarios: MElement[] = [];
  private elementsCounter = new StatusCounter();
  private stepsCounter = new StatusCounter();

  private featureStatus!: ReportStatus;
  private duration: number = 0;

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly uri: string,
    public readonly keyword: string,
    public readonly elements: MElement[],
    public readonly tags: MTag[],
    public readonly description?: string,
    public readonly line?: number,
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IFeature) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. Feature object expected.');
    }

    if (!isString(jsonData.id)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'id' field.`);
    }

    if (!isString(jsonData.name)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'name' field.`);
    }

    if (!isString(jsonData.uri)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'uri' field.`);
    }

    if (!isString(jsonData.keyword)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'keyword' field.`);
    }

    if (!Helper.isOptionalString(jsonData.description)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'description' field.`);
    }

    if (!Helper.isOptionalInteger(jsonData.line)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'line' field.`);
    }

    return new MFeature(
      jsonData.id,
      jsonData.name,
      jsonData.uri,
      jsonData.keyword,
      Helper.mapJsonArray(configuration, jsonData.elements, MElement.fromJson),
      Helper.mapJsonArray(configuration, jsonData.tags, MTag.fromJson),
      jsonData.description,
      toInteger(jsonData.line),
    );
  }

  public getDuration(): number {
    return this.duration;
  }

  public getFormattedDuration(): string {
    return Helper.formatDuration(this.duration);
  }

  public getPassedScenarios(): number {
    return this.elementsCounter.getValueFor('PASSED');
  }

  public getFailedScenarios(): number {
    return this.elementsCounter.getValueFor('FAILED');
  }

  public getName(): string {
    return this.name ?? '';
  }

  public getFailedFeatures(): number {
    return this.getStatus().isPassed ? 0 : 1;
  }

  public getFailedSteps(): number {
    return this.stepsCounter.getValueFor('FAILED');
  }

  public getFeatures(): number {
    return 1;
  }

  public getPassedFeatures(): number {
    return this.getStatus().isPassed ? 1 : 0;
  }

  public getPassedSteps(): number {
    return this.stepsCounter.getValueFor('PASSED');
  }

  public getPendingSteps(): number {
    return this.stepsCounter.getValueFor('PENDING');
  }

  public getScenarios(): number {
    return this.scenarios.length;
  }

  public getSkippedSteps(): number {
    return this.stepsCounter.getValueFor('SKIPPED');
  }

  public getStatus(): ReportStatus {
    return this.featureStatus;
  }

  public getSteps(): number {
    return this.stepsCounter.size;
  }

  public getUndefinedSteps(): number {
    return this.stepsCounter.getValueFor('UNDEFINED');
  }

  /**
   * Sets additional information and calculates values which should be calculated during object creation.
   *
   * @param jsonFileNo    index of the JSON file
   * @param configuration configuration for the report
   */
  public setMetaData(jsonFileNo: number, configuration: Configuration): void {
    for (const element of this.elements) {
      element.setMetaData(this, configuration);

      if (element.isScenario()) {
        this.scenarios.push(element);
      }
    }

    this.reportFileName = this.calculateReportFileName(jsonFileNo);
    this.featureStatus = this.calculateFeatureStatus();

    this.calculateSteps();
  }

  private calculateReportFileName(jsonFileNo: number): string {
    // remove all characters that might not be valid file name
    let fileName: string = 'report-feature_';

    // if there is only one report file or this is first one, don't add unnecessary numeration
    if (jsonFileNo > 0) {
      // add jsonFile index to the file name so if two the same features are reported
      // in two different JSON files then file name must be different
      fileName += `${jsonFileNo}_`;
    }

    fileName += Helper.toValidFileName(this.uri);

    fileName += `.html`;

    return fileName;
  }

  private calculateFeatureStatus(): ReportStatus {
    const statusCounter = new StatusCounter();

    for (const element of this.elements) {
      statusCounter.incrementFor(element.getStatus());
    }

    return statusCounter.finalStatus;
  }

  private calculateSteps(): void {
    for (const element of this.elements) {
      if (element.isScenario()) {
        this.elementsCounter.incrementFor(element.getStatus());
      }

      for (const step of element.steps) {
        this.stepsCounter.incrementFor(step.result.status);
        this.duration += step.getDuration();
      }
    }
  }

  public addElements(newElements: MElement[]): void {
    this.elements.push(...newElements);
  }
}
