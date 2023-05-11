import { NumOrString } from './utility.type';

export const allowedStatus = ['PASSED', 'FAILED', 'SKIPPED', 'PENDING', 'UNDEFINED', 'AMBIGUOUS'] as const;

export type Status = typeof allowedStatus[number];
export type EmbeddingType = 'DATA' | 'URL' | 'NONE';

export interface ITag {
  readonly name: string;
  readonly line: number;
}

export interface IResult {
  readonly status: Status;
  readonly error_message?: string;
  readonly duration?: number;
}

export interface IRow {
  readonly cells: string[];
  readonly line?: number;
}

export interface IArg {
  readonly rows?: IRow[];
  readonly val?: string;
  readonly offset?: number;
}

export interface IMatch {
  readonly location?: string;
  readonly arguments?: IArg[];
}

export interface IOutput {
  readonly messages: string[];
}

export interface IMedia {
  readonly type: string;
}

export interface IDataEmbedding {
  readonly mime_type: string;
  readonly data: string;
  readonly name?: string;
}

export interface IUrlEmbedding {
  readonly media: IMedia;
  readonly data: string;
}

export type IEmbedding = IDataEmbedding | IUrlEmbedding;

export interface IHook {
  readonly result: IResult;
  readonly match?: IMatch;
  readonly output?: IOutput[] | string[];
  readonly embeddings?: IEmbedding[];
}

export interface IDocString {
  readonly value: string;
  readonly content_type: string;
  readonly line: number;
}

export interface IComment {
  readonly value: string;
  readonly line: number;
}

export interface IStep {
  readonly name: string;
  readonly keyword: string;
  readonly line?: number;
  readonly comments?: IComment[] | string[];
  readonly result?: IResult;
  readonly rows?: IRow[];
  readonly arguments?: IArg[];
  readonly match?: IMatch;
  readonly matchedColumns?: number[];
  readonly embeddings?: IEmbedding[];
  readonly output?: IOutput[] | string[][] | NumOrString[];
  readonly doc_string?: IDocString;
  readonly before?: IHook[];
  readonly after?: IHook[];
}

export interface IElement {
  readonly id?: string;
  readonly name?: string;
  readonly type: string;
  readonly description?: string;
  readonly keyword: string;
  readonly line?: number;
  readonly start_timestamp?: string;
  readonly steps: IStep[];
  readonly before?: IHook[];
  readonly after?: IHook[];
  readonly tags?: ITag[];
}

export interface IFeature {
  readonly id: string;
  readonly name: string;
  readonly uri: string;
  readonly description?: string;
  readonly keyword: string;
  readonly line?: number;
  readonly elements: IElement[];
  readonly tags?: ITag[];
}

export type OutputType = 'SIMPLE' | '2DSTRING' | 'STRNUM';
