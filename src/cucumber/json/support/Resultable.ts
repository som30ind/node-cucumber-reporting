import { MMatch } from '../Match';
import { MResult } from '../Result';
import { MOutput } from '../Output';

export interface Resultsable {
  getResult(): MResult;
  getMatch(): MMatch;
  getOutputs(): MOutput[];
}
