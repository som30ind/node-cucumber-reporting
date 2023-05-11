import { isInteger, isPlainObject, isString, toInteger } from 'lodash';
import { ITag } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { Configuration } from '../Configuration';

export class MTag {
  private constructor(
    public readonly name: string,
    public readonly line: number
  ) { }

  public static fromJson(configuration: Configuration, jsonData: ITag) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. ITag object expected.');
    }

    if (!isString(jsonData.name)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'name' field.`);
    }

    if (!isInteger(jsonData.line)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'line' field.`);
    }

    return new MTag(
      jsonData.name,
      toInteger(jsonData.line),
    );
  }

  public static generateFileName(tagName: string): string {
    return `report-tag_${Helper.toValidFileName(tagName)}.html`;
  }
}
