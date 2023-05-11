import { isPlainObject, isString, toInteger } from 'lodash';
import { Configuration } from '../Configuration';
import { IStep } from '../../types/report.type';
import { InvalidDataException, InvalidDataExceptionCode, JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MArg } from './Arg';
import { MComment } from './Comment';
import { MDocString } from './DocString';
import { MEmbedding } from './Embedding';
import { MHook } from './Hook';
import { MMatch } from './Match';
import { MOutput } from './Output';
import { MResult } from './Result';
import { MRow } from './Row';
import { parseEmbedding } from './support/ModelHelper';
import { ReportStatus } from './support/ReportStatus';
import { Resultsable } from './support/Resultable';
import { StatusCounter } from './support/StatusCounter';

export class MStep implements Resultsable {
  private beforeStatus!: ReportStatus;
  private afterStatus!: ReportStatus;

  private constructor(
    public readonly name: string,
    public readonly keyword: string,
    public readonly result: MResult,
    public readonly match: MMatch,
    public readonly comments: string[],
    public readonly line: number,
    public readonly rows: MRow[],
    // arguments
    public readonly args: MArg[],
    public readonly matchedColumns: number[],
    public readonly embeddings: MEmbedding[],
    // output
    public readonly outputs: MOutput[],
    public readonly before: MHook[],
    public readonly after: MHook[],
    // doc_string
    public readonly docString?: MDocString,
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IStep) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IStep object expected.');
    }

    if (!isString(jsonData.name)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'name' field.`);
    }

    if (!isString(jsonData.keyword)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'keyword' field.`);
    }

    if (!Helper.isOptionalInteger(jsonData.line)) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'line' field.`);
    }

    let comments: string[] = [];

    if (Array.isArray(jsonData.comments)) {
      if (Helper.isStringArray(jsonData.comments)) {
        comments = jsonData.comments as string[];
      } else {
        comments = Helper.mapJsonArray(configuration, jsonData.comments as MComment[], MComment.fromJson).map(c => c.value);
      }
    }

    if (!Helper.isIntegerArray(jsonData.matchedColumns ?? [])) {
      throw new InvalidDataException(InvalidDataExceptionCode.INVALID_DATA_VALUE, `Invalid value in 'matchedColumns' field.`);
    }

    return new MStep(
      jsonData.name,
      jsonData.keyword,
      Helper.mapJson(configuration, jsonData.result, MResult.fromJson) ?? MResult.defaultObject(),
      Helper.mapJson(configuration, jsonData.match, MMatch.fromJson) ?? MMatch.defaultObject(),
      comments,
      toInteger(jsonData.line),
      Helper.mapJsonArray(configuration, jsonData.rows, MRow.fromJson),
      Helper.mapJsonArray(configuration, jsonData.arguments, MArg.fromJson),
      jsonData.matchedColumns ?? [],
      parseEmbedding(configuration, jsonData.embeddings),
      Helper.mapJsonArray(configuration, jsonData.output, MOutput.fromJson),
      Helper.mapJsonArray(configuration, jsonData.before, MHook.fromJson),
      Helper.mapJsonArray(configuration, jsonData.after, MHook.fromJson),
      Helper.mapJson(configuration, jsonData.doc_string, MDocString.fromJson),
    );
  }

  public getMatch(): MMatch {
    return this.match;
  }

  public getOutputs(): MOutput[] {
    return this.outputs;
  }

  public getResult(): MResult {
    return this.result;
  }

  public setMetaData(): void {
    this.beforeStatus = new StatusCounter(this.before).finalStatus;
    this.afterStatus = new StatusCounter(this.after).finalStatus;
  }

  public getDuration(): number {
    return this.result.duration;
  }

  public getBeforeStatus(): ReportStatus {
    return this.beforeStatus;
  }

  public getAfterStatus(): ReportStatus {
    return this.afterStatus;
  }
}
