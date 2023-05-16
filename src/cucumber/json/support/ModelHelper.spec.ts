import { describe, expect, it, jest } from '@jest/globals';

import { EmbeddingType, IEmbedding } from '../../../types/report.type';
import { InvalidDataException } from '../../../types/utility.type';
import { Configuration } from '../../Configuration';
import { MDataEmbedding } from '../DataEmbedding';
import { MUrlEmbedding } from '../UrlEmbedding';
import { detectEmbedType, parseEmbedding } from './ModelHelper';

jest.mock('../../Configuration');

describe('ModelHelper', () => {
  const detectEmbedTypeCheck: {
    input: IEmbedding;
    expected: EmbeddingType;
  }[] = [
      { input: { mime_type: 'image/png', data: 'Image Data' }, expected: 'DATA' },
      { input: { media: { type: 'image/png' }, data: 'Image Data' }, expected: 'URL' },
      { input: { data: 'Image Data' } as IEmbedding, expected: 'NONE' },
    ];

  for (const { input, expected } of detectEmbedTypeCheck) {
    it(`Should be able to get result detectEmbedType(${JSON.stringify(input)})`, () => {
      const actual = detectEmbedType(input);
      expect(actual).toEqual(expected);
    });
  }

  const parseEmbeddingCheck1: {
    input: {
      configuration: Configuration;
      embeddings: IEmbedding[] | undefined;
    };
    expected: {
      dataEmbed: number;
      urlEmbed: number;
      exception: boolean;
    };
  }[] = [
      { input: { configuration: new Configuration(), embeddings: undefined }, expected: { dataEmbed: 0, exception: false, urlEmbed: 0 } },
      { input: { configuration: new Configuration(), embeddings: undefined }, expected: { dataEmbed: 0, exception: false, urlEmbed: 0 } },
      { input: { configuration: new Configuration(), embeddings: [] }, expected: { dataEmbed: 0, exception: false, urlEmbed: 0 } },
      {
        input: {
          configuration: new Configuration(), embeddings: [
            { mime_type: 'image/png', data: '' },
            { media: { type: 'image/png' }, data: '' },
          ]
        }, expected: { dataEmbed: 1, exception: false, urlEmbed: 1 }
      },
      {
        input: {
          configuration: new Configuration(), embeddings: [
            { mime_type: 'image/png', data: '' },
            { media: { type: 'image/png' }, data: '' },
            { data: 'Image Data' } as IEmbedding,
          ]
        }, expected: { dataEmbed: 1, urlEmbed: 1, exception: true }
      },
    ];

  for (const { input, expected } of parseEmbeddingCheck1) {
    it(`Should be able to get result parseEmbedding(configuration, ${JSON.stringify(input.embeddings)})`, () => {
      const fromJsonData = jest
        .spyOn(MDataEmbedding, 'fromJson')
        .mockImplementation(() => ({} as MDataEmbedding));

      const fromJsonUrl = jest
        .spyOn(MUrlEmbedding, 'fromJson')
        .mockImplementation(() => ({} as MUrlEmbedding));

      let exceptionThrown: any;

      try {
        parseEmbedding(input.configuration, input.embeddings);
      } catch (e) {
        exceptionThrown = e;
      }

      if (expected.exception) {
        expect(exceptionThrown).toBeInstanceOf(InvalidDataException);
      } else {
        expect(exceptionThrown).toBeUndefined();
        expect(fromJsonData).toHaveBeenCalledTimes(expected.dataEmbed);
        expect(fromJsonUrl).toHaveBeenCalledTimes(expected.urlEmbed);
      }
    });
  }

  const parseEmbeddingCheck2: {
    input: {
      configuration: Configuration;
    };
    expected: {
      dataEmbed: number;
      urlEmbed: number;
      exception: boolean;
    };
  }[] = [
      { input: { configuration: new Configuration() }, expected: { dataEmbed: 0, exception: false, urlEmbed: 0 } },
    ];

  for (const { input, expected } of parseEmbeddingCheck2) {
    it(`Should be able to get result parseEmbedding(configuration)`, () => {
      const fromJsonData = jest
        .spyOn(MDataEmbedding, 'fromJson')
        .mockImplementation(() => ({} as MDataEmbedding));

      const fromJsonUrl = jest
        .spyOn(MUrlEmbedding, 'fromJson')
        .mockImplementation(() => ({} as MUrlEmbedding));

      let exceptionThrown: any;

      try {
        parseEmbedding(input.configuration);
      } catch (e) {
        exceptionThrown = e;
      }

      if (expected.exception) {
        expect(exceptionThrown).toBeInstanceOf(InvalidDataException);
      } else {
        expect(exceptionThrown).toBeUndefined();
        expect(fromJsonData).toHaveBeenCalledTimes(expected.dataEmbed);
        expect(fromJsonUrl).toHaveBeenCalledTimes(expected.urlEmbed);
      }
    });
  }
});
