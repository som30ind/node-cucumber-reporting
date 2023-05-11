import { has } from 'lodash';
import { Configuration } from '../../Configuration';
import { EmbeddingType, IDataEmbedding, IEmbedding, IUrlEmbedding } from '../../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode } from '../../../types/utility.type';
import { MDataEmbedding } from '../DataEmbedding';
import { MEmbedding } from '../Embedding';
import { MUrlEmbedding } from '../UrlEmbedding';

export function detectEmbedType(embed: IEmbedding): EmbeddingType {
  if (has(embed, 'mime_type')) {
    return 'DATA';
  }

  if (has(embed, 'media')) {
    return 'URL';
  }

  return 'NONE';
}

export function parseEmbedding(configuration: Configuration, embeddings?: IEmbedding[]): MEmbedding[] {
  if (Array.isArray(embeddings)) {
    return embeddings.map(embed => {
      const embedType = detectEmbedType(embed);

      if (embedType === 'DATA') {
        return MDataEmbedding.fromJson(configuration, embed as IDataEmbedding);
      }

      if (embedType === 'URL') {
        return MUrlEmbedding.fromJson(configuration, embed as IUrlEmbedding);
      }

      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'embeddings' field.`);
    });
  }

  return [];
}
