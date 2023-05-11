import { MFeature } from '../json/Feature';
import { ReducingMethod } from './ReducingMethod';
import { ReportFeatureMerger } from './ReportFeatureMerger';

export class ReportFeatureAppendableMerger implements ReportFeatureMerger {
  public merge(features: MFeature[]): MFeature[] {
    return Array.isArray(features) ? features : [];
  }

  public test(reducingMethods: ReducingMethod[]): boolean {
    return true;
  }
}
