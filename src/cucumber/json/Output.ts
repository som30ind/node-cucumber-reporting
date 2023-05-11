import { isPlainObject } from 'lodash';
import { Configuration } from '../Configuration';
import { IOutput } from '../../types/report.type';
import { JsonParseException, JsonParseExceptionCode, NumOrString } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';

export class MOutput {
  private constructor(
    public readonly messages: string[]
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IOutput | string[] | NumOrString) {
    if (typeof jsonData === 'string') {
      return new MOutput([jsonData]);
    }

    if (typeof jsonData === 'number') {
      return new MOutput([`${jsonData}`]);
    }

    if (Array.isArray(jsonData)) {
      if (Helper.isStringArray(jsonData)) {
        return new MOutput(jsonData);
      }

      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. string[] expected.');
    }

    if (isPlainObject(jsonData)) {
      if (Helper.isStringArray(jsonData.messages)) {
        return new MOutput(jsonData.messages);
      }

      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IOutput expected.');
    }

    throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input.');
  }
}
