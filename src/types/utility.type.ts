export enum JsonParseExceptionCode {
  INVALID_JSON_INPUT,
  NO_INPUT_FILES,
  NO_FEATURES
}

export enum InvalidDataExceptionCode {
  INVALID_DATA_VALUE
}

export class Exception extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RuntimeException extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'RuntimeException';
  }
}

export class IllegalArgumentException extends RuntimeException {
  constructor(message: string) {
    super(message);

    this.name = 'IllegalArgumentException';
  }
}

export class NotImplementedException extends Exception {
  constructor(message = 'Method not implemented.') {
    super(message);

    this.name = 'NotImplementedException';
  }
}


class CommonException<T> extends RuntimeException {
  constructor(
    public readonly code: T,
    readonly message: string
  ) {
    super(message);
  }
}

export class JsonParseException extends CommonException<JsonParseExceptionCode> { }
export class InvalidDataException extends CommonException<InvalidDataExceptionCode> { }

export type NumOrString = string | number;
export interface Comparator<T> {
  compare(a: T, b: T): number;
}

export interface Predicate<T> {
  test(item: T): boolean;
}
