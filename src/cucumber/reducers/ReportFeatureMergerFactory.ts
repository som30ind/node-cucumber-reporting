import { ReducingMethod } from './ReducingMethod';
import { ReportFeatureAppendableMerger } from './ReportFeatureAppendableMerger';
import { ReportFeatureByIdMerger } from './ReportFeatureByIdMerger';
import { ReportFeatureMerger } from './ReportFeatureMerger';
import { ReportFeatureWithRetestMerger } from './ReportFeatureWithRetestMerger';

export class ReportFeatureMergerFactory {
  private mergers: ReportFeatureMerger[] = [
    new ReportFeatureByIdMerger(),
    new ReportFeatureWithRetestMerger()
  ];

  /**
   * @param reducingMethods - full list of reduce methods.
   * @return a merger for features by ReduceMethod with a priority mentioned in the method.
   */
  public get(reducingMethods: ReducingMethod[]): ReportFeatureMerger {
    const methods = Array.isArray(reducingMethods) ? reducingMethods : [];

    return this.mergers
      .filter(m => m.test(methods))
      .at(0) ?? new ReportFeatureAppendableMerger();
  }
}
