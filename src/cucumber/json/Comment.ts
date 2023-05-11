import { isInteger, isPlainObject, isString } from 'lodash';
import { Configuration } from '../Configuration';
import { IComment } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';

export class MComment {
  private constructor(
    public readonly value: string,
    public readonly line: number
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IComment) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IComment object expected.');
    }

    if (!isString(jsonData.value)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'value' field.`);
    }

    if (!isInteger(jsonData.line)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'line' field.`);
    }

    return new MComment(
      jsonData.value,
      jsonData.line,
    );
  }
}
