import { isPlainObject, isString } from 'lodash';
import { Configuration } from '../Configuration';
import { IMedia } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';

export class MMedia {
  private constructor(
    public readonly type: string
  ) { }

  public static fromJson(configuation: Configuration, jsonData: IMedia) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IMedia object expected.');
    }

    if (!isString(jsonData.type)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'type' field.`);
    }

    return new MMedia(
      jsonData.type,
    );
  }
}
