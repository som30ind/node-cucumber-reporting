import { isPlainObject } from 'lodash';
import { Configuration } from '../Configuration';
import { IRow } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';

export class MRow {
  private constructor(
    public readonly cells: string[],
    public readonly line?: number,
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IRow) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IRow object expected.');
    }

    if (!Helper.isStringArray(jsonData.cells)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'cells' field.`);
    }

    return new MRow(
      jsonData.cells
    );
  }
}
