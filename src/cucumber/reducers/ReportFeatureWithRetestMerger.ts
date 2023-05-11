import { compareAsc, isValid } from 'date-fns';
import { IllegalArgumentException } from '../../types/utility.type';
import { MElement } from '../json/Element';
import { MFeature } from '../json/Feature';
import { ElementComparator } from './ElementComparator';
import { ReducingMethod } from './ReducingMethod';
import { ReportFeatureMerger } from './ReportFeatureMerger';

/**
 * Merge list of given features. If there are couple of scenarios with the same Id then
 * only the latest will be stored into the report.
 *
 * Uses when need to generate a report with rerun results of failed tests.
 */
export class ReportFeatureWithRetestMerger implements ReportFeatureMerger {
  private static readonly ERROR = 'You are not able to use this type of results merge. The start_timestamp field' +
    ' should be part of element object. Please, update the cucumber-jvm version.';
  private static readonly ELEMENT_COMPARATOR = new ElementComparator();

  public merge(features: MFeature[]): MFeature[] {
    const mergedFeatures: Record<string, MFeature> = {};

    for (const candidate of features) {
      const mergedFeature = mergedFeatures[candidate.id];

      if (!mergedFeature) {
        mergedFeatures[candidate.id] = candidate;
      } else {
        this.updateElements(mergedFeatures[candidate.id], candidate.elements);
      }
    }

    return Object.values(mergedFeatures);
  }

  /**
   * Updates feature's elements with items from the @elements list if an Id of the item coincides
   * with an Id of any element from the @feature object. If there is no element in the @feature object
   * then the item is appended to the end of the elements' list of the @feature.
   *
   * @param feature  - target object of Feature class.
   * @param elements - list of elements which need to be inserted to the @feature with replacing
   *                   or adding to the end.
   */
  public updateElements(feature: MFeature, elements: MElement[]): void {
    for (let i = 0; i < elements.length; i++) {
      const current = elements[i];

      if (current.isScenario()) {
        if (!isValid(current.startTimestamp)) {
          throw new IllegalArgumentException(ReportFeatureWithRetestMerger.ERROR);
        }

        const indexOfPreviousResult = this.find(feature.elements, current);
        const hasBackground = this.isBackground(i - 1, elements);

        if (indexOfPreviousResult < 0) {
          feature.addElements(hasBackground ? [elements[i - 1], current] : [current]);
        } else {
          if (this.replaceIfExists(feature.elements[indexOfPreviousResult], current)) {
            feature.elements[indexOfPreviousResult] = current;

            if (hasBackground && this.isBackground(indexOfPreviousResult - 1, feature.elements)) {
              feature.elements[indexOfPreviousResult - 1] = elements[i - 1];
            }
          }
        }
      }
    }
  }

  /**
   * @return true when candidate element happened after the target element.
   */
  public replaceIfExists(target: MElement, candidate: MElement): boolean {
    if (!isValid(candidate.startTimestamp) || !isValid(target.startTimestamp)) {
      return false;
    }

    const dateLeft = candidate.startTimestamp as Date;
    const dateRight = target.startTimestamp as Date;

    return compareAsc(dateLeft, dateRight) >= 0;
  }

  /**
   * @return true when element from elements array with index=elementInd is a background.
   */
  public isBackground(elementInd: number, elements: MElement[]): boolean {
    return elementInd >= 0 && Array.isArray(elements) && elementInd < elements.length && elements[elementInd].isBackground();
  }

  /**
   * @return an index of an element which is indicated as similar by rules
   * defined in the ELEMENT_COMPARATOR. The comparator indicates that
   * an element is found in the elements list with the same Id (for scenario)
   * as target element has or it's on the same line (for background).
   */
  public find(elements: MElement[], target: MElement): number {
    for (let i = 0; i < elements.length; i++) {
      if (ReportFeatureWithRetestMerger.ELEMENT_COMPARATOR.compare(elements[i], target) == 0) {
        return i;
      }
    }

    return -1;
  }

  public test(reducingMethods: ReducingMethod[]): boolean {
    return reducingMethods != null && reducingMethods.includes('MERGE_FEATURES_WITH_RETEST');
  }
}
