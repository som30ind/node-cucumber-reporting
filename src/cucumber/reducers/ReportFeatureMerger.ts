import { Predicate } from '../../types/utility.type';
import { MFeature } from '../json/Feature';
import { ReducingMethod } from './ReducingMethod';

export interface ReportFeatureMerger extends Predicate<ReducingMethod[]> {
    /**
     * Merger's type depends on a ReducingMethod which is coming from the configuration.
     *
     * @param features features for merger
     * @return list of features which are organized by merger.
     * @see ReportFeatureAppendableMerger
     * @see ReportFeatureByIdMerger
     * @see ReportFeatureWithRetestMerger
     */
    merge(features: MFeature[]): MFeature[];
}
