import { isPlainObject, isString } from 'lodash';
import { Configuration } from '../Configuration';
import { EmbeddingType, IUrlEmbedding } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { MMedia } from './Media';

export class MUrlEmbedding {
  public readonly embedType: EmbeddingType = 'URL';

  private constructor(
    public readonly media: MMedia,
    public readonly data: string
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IUrlEmbedding) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IUrlEmbedding object expected.');
    }

    if (!isString(jsonData.data)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'data' field.`);
    }

    return new MUrlEmbedding(
      MMedia.fromJson(configuration, jsonData.media),
      jsonData.data,
    );
  }
}
