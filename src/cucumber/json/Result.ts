import { isPlainObject, isString, toInteger } from 'lodash';
import { Configuration } from '../Configuration';
import { IResult, Status, allowedStatus } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { Durationable } from './support/Durationable';
import { ReportStatus } from './support/ReportStatus';

export class MResult implements Durationable {
  private constructor(
    public readonly status: ReportStatus,
    // error_message
    public readonly errorMessage?: string,
    public readonly duration: number = 0
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IResult) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IResult object expected.');
    }

    if (!isString(jsonData.status) || !allowedStatus.includes(jsonData.status.toUpperCase() as Status)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'status' field.`);
    }

    if (!Helper.isOptionalString(jsonData.error_message)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'error_message' field.`);
    }

    if (!Helper.isOptionalInteger(jsonData.duration)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'duration' field.`);
    }

    return new MResult(
      new ReportStatus(jsonData.status.toUpperCase() as Status),
      jsonData.error_message,
      toInteger(jsonData.duration),
    );
  }

  public static defaultObject() {
    return new MResult(
      new ReportStatus('UNDEFINED'),
      undefined,
      0,
    );
  }

  public getFormattedDuration(): string {
    return Helper.formatDuration(this.duration);
  }

  getDuration(): number {
    return this.duration;
  }
}
