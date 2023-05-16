import { describe, expect, it, jest } from '@jest/globals';
import { handleException } from '../../test-helpers/test.helper';
import { IDataEmbedding } from '../../types/report.type';
import { InvalidDataException, JsonParseException } from '../../types/utility.type';
import { Configuration } from '../Configuration';
import { MDataEmbedding } from './DataEmbedding';

describe('MDataEmbedding', () => {
  jest.mock('../Configuration');
  jest.mock('../helpers/Helper');
  jest.mock('fs-extra');

  const conf = new Configuration();
  const fromJsonCase: {
    input: IDataEmbedding;
    expected: {
      mimeType?: string;
      data?: string;
      name?: string,
      exception?: unknown;
      extension?: string;
    };
  }[] = [
      {
        input: undefined as unknown as IDataEmbedding,
        expected: {
          exception: JsonParseException
        }
      },
      {
        input: {
          mime_type: 0 as unknown as string,
          data: 0 as unknown as string
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          mime_type: 0 as unknown as string,
          data: 'DATA'
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          mime_type: 'text/plain',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 0 as unknown as string
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          mime_type: 'image/png',
          data: 0 as unknown as string
        },
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {} as IDataEmbedding,
        expected: {
          exception: InvalidDataException
        }
      },
      {
        input: {
          mime_type: 'text/plain',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'text/plain',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'txt'
        }
      },
      {
        input: {
          mime_type: 'text/plain; charset=UTF8',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'text/plain; charset=UTF8',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'txt'
        }
      },
      {
        input: {
          mime_type: 'image/svg+x; charset=UTF8',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'image/svg+x; charset=UTF8',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'svg'
        }
      },
      {
        input: {
          mime_type: 'image/url',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'image/url',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'image'
        }
      },
      {
        input: {
          mime_type: 'application/ecmascript',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/ecmascript',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'es'
        }
      },
      {
        input: {
          mime_type: 'application/javascript',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/javascript',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'js'
        }
      },
      {
        input: {
          mime_type: 'application/x-tar',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/x-tar',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'tar'
        }
      },
      {
        input: {
          mime_type: 'application/x-bzip2',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/x-bzip2',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'bz2'
        }
      },
      {
        input: {
          mime_type: 'application/gzip',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/gzip',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'gz'
        }
      },
      {
        input: {
          mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'xlsx'
        }
      },
      {
        input: {
          mime_type: 'application/vnd.ms-excel',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name'
        },
        expected: {
          mimeType: 'application/vnd.ms-excel',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'Some Name',
          extension: 'xls'
        }
      },
      {
        input: {
          mime_type: 'application/unknown',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'filename.cust'
        },
        expected: {
          mimeType: 'application/unknown',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'filename.cust',
          extension: 'cust'
        }
      },
      {
        input: {
          mime_type: 'application/janina',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'filename At'
        },
        expected: {
          mimeType: 'application/janina',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'filename At',
          extension: 'janina'
        }
      },
      {
        input: {
          mime_type: 'chinina',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'filename At'
        },
        expected: {
          mimeType: 'chinina',
          data: 'amF2YS5sYW5nLlRocm93YWJsZQ==',
          name: 'filename At',
          extension: Configuration.UNKNOWN_FILE_EXTENSION
        }
      },
    ];

  for (const { input, expected } of fromJsonCase) {
    it(`Should perform validation of MDataEmbedding.fromJson(${JSON.stringify(input)})`, () => {
      const fromJson = MDataEmbedding.fromJson.bind(MDataEmbedding, conf, input) as () => MDataEmbedding;

      if (expected.exception) {
        expect(handleException(fromJson)).toBeInstanceOf(expected.exception);
      } else {
        const so = fromJson();
        expect(so.mimeType).toEqual(expected.mimeType);
        expect(so.data).toEqual(expected.data);
        expect(so.name).toEqual(expected.name);
        expect(so.findExtension()).toEqual(expected.extension);
      }
    });
  }
});
