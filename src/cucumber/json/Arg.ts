import { isPlainObject, toInteger } from 'lodash';
import { Configuration } from '../Configuration';
import { IArg } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MRow } from './Row';

export class MArg {
  private constructor(
    public readonly rows?: MRow[],
    public readonly val?: string,
    public readonly offset?: number
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IArg) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IArg object expected.');
    }

    if (!Helper.isOptionalString(jsonData.val)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'val' field.`);
    }

    if (!Helper.isOptionalInteger(jsonData.offset)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'offset' field.`);
    }

    return new MArg(
      Helper.mapJsonArray(configuration, jsonData.rows, MRow.fromJson),
      jsonData.val,
      toInteger(jsonData.offset),
    );
  }
}
