import { Comparator } from '../../types/utility.type';
import { StepObject } from '../json/support/StepObject';

export class StepObjectAlphabeticalComparator implements Comparator<StepObject> {
  public compare(stepObject1: StepObject, stepObject2: StepObject): number {
    // since there might be the only one StepObject with given location, compare by location only
    return (stepObject1.location ?? '').localeCompare((stepObject2.location ?? ''));
  }
}
