import { isInteger, isPlainObject, isString } from 'lodash';
import { IDocString } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Configuration } from '../Configuration';

export class MDocString {
  private constructor(
    public readonly value: string,
    // content_type
    public readonly contentType: string,
    public readonly line: number
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IDocString) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IDocString object expected.');
    }

    if (!isString(jsonData.value)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'value' field.`);
    }

    if (!isString(jsonData.content_type)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'contentType' field.`);
    }

    if (!isInteger(jsonData.line)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'line' field.`);
    }

    return new MDocString(
      jsonData.value,
      jsonData.content_type,
      jsonData.line,
    );
  }
}
