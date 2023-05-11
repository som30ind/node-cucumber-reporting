import { outputFileSync } from 'fs-extra';
import { isPlainObject, isString } from 'lodash';
import { resolve } from 'node:path';
import { Configuration } from '../Configuration';
import { EmbeddingType, IDataEmbedding } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';

export class MDataEmbedding {
  public readonly embedType: EmbeddingType = 'DATA';
  public readonly fileId: string;
  public readonly fileName: string;
  public readonly decodedData: string;

  private constructor(
    configuration: Configuration,
    // mime_type
    public readonly mimeType: string,
    public readonly data: string,
    public readonly name?: string,
  ) {
    this.fileId = `embedding_` + Helper.generateHashCode(data);
    this.fileName = `${this.fileId}.${this.findExtension()}`;
    this.decodedData = Buffer.from(this.data, 'base64').toString('utf8');
    this.generateEmbedding(configuration);
  }

  public static fromJson(configuration: Configuration, jsonData: IDataEmbedding) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IDataEmbedding object expected.');
    }

    if (!isString(jsonData.mime_type)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'mime_type' field.`);
    }

    if (!isString(jsonData.data)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'data' field.`);
    }

    if (!Helper.isOptionalString(jsonData.name)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'name' field.`);
    }

    return new MDataEmbedding(
      configuration,
      jsonData.mime_type,
      jsonData.data,
      jsonData.name,
    );
  }

  private generateEmbedding(configuration: Configuration): void {
    const filePath = resolve(configuration.reportDir, Configuration.embeddingsDir, `${this.fileName}`);
    const decodedData = Buffer.from(this.data, 'base64');

    outputFileSync(filePath, decodedData);
  }

  /**
   * Returns the file extension of this embedding (attachment).
   * 
   * In case the {{@link #getMimeType() embedding's MIME-type} is well-known, the according file extension is returned
   * immediately.
   * 
   * In case the MIME-type is unknown, as a first try the {@link #getName() embedding's name} will be used in order to
   * derive a file extension. If the name contains a file name delimiter (i.e., "{@code .}"), the following characters are
   * used as the file extension as long as they match {@value #FILE_EXTENSION_PATTERN}. As a second try, the MIME-type's
   * subtype will be used in order to derive a file extension (as long as such subtype is given). Similar, the subtype is
   * used as the file extension as long as it matches {@value #FILE_EXTENSION_PATTERN}.
   * 
   * Finally (if neither a file extension is known nor can be derived), the value {@value #UNKNOWN_FILE_EXTENSION} will be
   * returned.
   * 
   * @return the file extension of this embedding (attachment)
   */
  public findExtension(): string {
    // prepare/ensure switch-case matching
    let mime = this.mimeType;

    // remove subtype's suffix (if existing)
    if (mime.includes('+')) {
      mime = mime.substring(0, mime.indexOf('+'));
    }

    // remove subtype's parameter (if existing)
    if (mime.includes(";")) {
      mime = mime.substring(0, mime.indexOf(';'));
    }

    // normalise
    mime = mime.toLowerCase().trim();

    switch (this.mimeType) {
      // image available remotely stored as link/url
      case 'image/url':
        return 'image';

      case 'text/plain':
        return 'txt';

      case 'application/ecmascript':
        return 'es';

      case 'application/javascript':
        return 'js';

      case 'application/x-tar':
        return 'tar';

      case 'application/x-bzip2':
        return 'bz2';

      case 'application/gzip':
        return 'gz';

      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'xlsx';

      case 'application/vnd.ms-excel':
        return 'xls';

      default:
        // assert the name is file-name formatted --> try file-name extension
        if (typeof this.name === 'string' && this.name.includes('.')) {
          const extension = this.name.substring(this.name.lastIndexOf('.') + 1);
          // the extension might by usable

          if (Configuration.FILE_EXTENSION_PATTERN.test(extension)) {
            return extension;
          }
        }

        // assert the mime-type contains a subtype --> try subtype
        if (mime.includes('/')) {
          const subtype = mime.substring(mime.indexOf('/') + 1);

          // the subtype might by usable
          if (Configuration.FILE_EXTENSION_PATTERN.test(subtype)) {
            return subtype;
          }
        }

        // if nothing works the extension is unknown
        return Configuration.UNKNOWN_FILE_EXTENSION;
    }
  }
}
