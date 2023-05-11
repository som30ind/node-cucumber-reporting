import { isPlainObject } from 'lodash';
import { Configuration } from '../Configuration';
import { IHook } from '../../types/report.type';
import { JsonParseException, JsonParseExceptionCode } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MEmbedding } from './Embedding';
import { MMatch } from './Match';
import { MOutput } from './Output';
import { MResult } from './Result';
import { IHasContent } from './support/IHasContent';
import { parseEmbedding } from './support/ModelHelper';
import { Resultsable } from './support/Resultable';

export class MHook implements Resultsable, IHasContent {
  private constructor(
    public readonly result: MResult,
    public readonly match: MMatch,
    // output
    public readonly outputs: MOutput[],
    public readonly embeddings: MEmbedding[]
  ) { }

  public static fromJson(configuration: Configuration, jsonData: IHook) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IHook object expected.');
    }

    return new MHook(
      MResult.fromJson(configuration, jsonData.result) ?? MResult.defaultObject(),
      Helper.mapJson(configuration, jsonData.match, MMatch.fromJson) ?? MMatch.defaultObject(),
      Helper.mapJsonArray(configuration, jsonData.output, MOutput.fromJson),
      parseEmbedding(configuration, jsonData.embeddings),
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

  /**
     * Checks if the hook has content meaning as it has at least attachment or result with error message.
     *
     * @return <code>true</code> if the hook has content otherwise <code>false</code>
     */
  public hasContent(): boolean {
    if (this.embeddings.length > 0) {
      // assuming that if the embedding exists then it is not empty
      return true;
    }

    // TODO: hook with 'output' should be treated as empty or not?
    return !!this.result.errorMessage;
  }
}
