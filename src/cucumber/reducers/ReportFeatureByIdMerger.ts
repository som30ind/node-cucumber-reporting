import { MFeature } from '../json/Feature';
import { ReducingMethod } from './ReducingMethod';
import { ReportFeatureMerger } from './ReportFeatureMerger';

export class ReportFeatureByIdMerger implements ReportFeatureMerger {
  public merge(features: MFeature[]): MFeature[] {
    const mergedFeatures: Record<string, MFeature> = {};

    for (const feature of features) {
      const mergedFeature = mergedFeatures[feature.id];

      if (!mergedFeature) {
        mergedFeatures[feature.id] = feature;
      } else {
        mergedFeatures[feature.id].addElements(feature.elements);
      }
    }

    return Object.values(mergedFeatures);
  }

  public test(reducingMethods: ReducingMethod[]): boolean {
    return reducingMethods != null && reducingMethods.includes('MERGE_FEATURES_BY_ID');
  }
}
