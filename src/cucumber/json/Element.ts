import { isPlainObject, isString, toInteger, toLower } from 'lodash';
import { Configuration } from '../Configuration';
import { IElement } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MHook } from './Hook';
import { MStep } from './Step';
import { MTag } from './Tag';
import { IElementable, IFeatureable } from './support/IFeatureable';
import { ReportStatus } from './support/ReportStatus';
import { StatusCounter } from './support/StatusCounter';

export class MElement implements IElementable {
  private static readonly SCENARIO_TYPE = 'scenario';
  private static readonly BACKGROUND_TYPE = 'background';

  private elementStatus!: ReportStatus;
  private beforeStatus!: ReportStatus;
  private afterStatus!: ReportStatus;
  private stepsStatus!: ReportStatus;

  private feature!: IFeatureable;
  private duration: number = 0;

  private constructor(
    public readonly type: string,
    public readonly keyword: string,
    public readonly steps: MStep[],
    public readonly before: MHook[],
    public readonly after: MHook[],
    public readonly id?: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly line?: number,
    // start_timestamp
    public readonly startTimestamp?: Date,
    public readonly tags?: MTag[],
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IElement) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IElement object expected.');
    }

    if (!isString(jsonData.type)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'type' field.`);
    }

    if (!isString(jsonData.keyword)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'keyword' field.`);
    }

    if (!Helper.isOptionalString(jsonData.id)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'id' field.`);
    }

    if (!Helper.isOptionalString(jsonData.name)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'name' field.`);
    }

    if (!Helper.isOptionalString(jsonData.description)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'description' field.`);
    }

    if (!Helper.isOptionalInteger(jsonData.line)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'line' field.`);
    }

    return new MElement(
      jsonData.type,
      jsonData.keyword,
      Helper.mapJsonArray(configuration, jsonData.steps, MStep.fromJson),
      Helper.mapJsonArray(configuration, jsonData.before, MHook.fromJson),
      Helper.mapJsonArray(configuration, jsonData.after, MHook.fromJson),
      jsonData.id,
      jsonData.name,
      jsonData.description,
      toInteger(jsonData.line),
      Helper.parseDate(jsonData.start_timestamp),
      Helper.mapJsonArray(configuration, jsonData.tags, MTag.fromJson),
    );
  }

  public getStatus(): ReportStatus {
    return this.elementStatus;
  }

  public getBeforeStatus(): ReportStatus {
    return this.beforeStatus;
  }

  public getAfterStatus(): ReportStatus {
    return this.afterStatus;
  }

  public getStepsStatus(): ReportStatus {
    return this.stepsStatus;
  }

  public isScenario(): boolean {
    return toLower(MElement.SCENARIO_TYPE) === toLower(this.type);
  }

  public isBackground(): boolean {
    return toLower(MElement.BACKGROUND_TYPE) === toLower(this.type);
  }

  public getFeature(): IFeatureable {
    return this.feature;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getFormattedDuration(): string {
    return Helper.formatDuration(this.duration);
  }

  public setMetaData(feature: IFeatureable, configuration: Configuration): void {
    this.feature = feature;

    for (const step of this.steps) {
      step.setMetaData();
    }

    this.beforeStatus = new StatusCounter(this.before, configuration.notFailingStatuses).finalStatus;
    this.afterStatus = new StatusCounter(this.after, configuration.notFailingStatuses).finalStatus;
    this.stepsStatus = new StatusCounter(this.steps, configuration.notFailingStatuses).finalStatus;
    this.elementStatus = this.calculateElementStatus();

    this.calculateDuration();
  }

  private calculateElementStatus(): ReportStatus {
    const statusCounter = new StatusCounter();
    statusCounter.incrementFor(this.stepsStatus);
    statusCounter.incrementFor(this.beforeStatus);
    statusCounter.incrementFor(this.afterStatus);

    return statusCounter.finalStatus;
  }

  private calculateDuration(): void {
    for (const step of this.steps) {
      this.duration += step.result?.duration ?? 0;
    }
  }
}
