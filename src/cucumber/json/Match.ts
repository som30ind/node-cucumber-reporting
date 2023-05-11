import { isPlainObject } from 'lodash';
import { Configuration } from '../Configuration';
import { IMatch } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MArg } from './Arg';

export class MMatch {
  private constructor(
    public readonly location?: string,
    public readonly args?: MArg[]
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IMatch) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IMatch object expected.');
    }

    if (!Helper.isOptionalString(jsonData.location)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'location' field.`);
    }

    return new MMatch(
      jsonData.location,
      Helper.mapJsonArray(configuration, jsonData.arguments, MArg.fromJson),
    );
  }

  public static defaultObject() {
    return new MMatch();
  }
}
