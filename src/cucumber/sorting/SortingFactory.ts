import { Comparator, IllegalArgumentException, RuntimeException } from '../../types/utility.type';
import { MFeature } from '../json/Feature';
import { StepObject } from '../json/support/StepObject';
import { TagObject } from '../json/support/TagObject';
import { FeaturesAlphabeticalComparator } from './FeaturesAlphabeticalComparator';
import { SortingMethod } from './SortingMethod';
import { StepObjectAlphabeticalComparator } from './StepObjectAlphabeticalComparator';
import { TagObjectAlphabeticalComparator } from './TagObjectAlphabeticalComparator';

export class SortingFactory {
  constructor(
    private readonly sortingMethod: SortingMethod
  ) { }

  public sortFeatures(features: MFeature[]): MFeature[] {
    switch (this.sortingMethod) {
      case 'NATURAL':
        return features;

      case 'ALPHABETICAL':
        return SortingFactory.toSortedList(features, new FeaturesAlphabeticalComparator());

      default:
        throw this.createUnknownMethodException(this.sortingMethod);
    }
  }

  public sortTags(tags: TagObject[]): TagObject[] {
    switch (this.sortingMethod) {
      case 'NATURAL':
        return tags;

      case 'ALPHABETICAL':
        return SortingFactory.toSortedList(tags, new TagObjectAlphabeticalComparator());

      default:
        throw this.createUnknownMethodException(this.sortingMethod);
    }
  }

  public sortSteps(steps: StepObject[]): StepObject[] {
    switch (this.sortingMethod) {
      case 'NATURAL':
        return steps;

      case 'ALPHABETICAL':
        return SortingFactory.toSortedList(steps, new StepObjectAlphabeticalComparator());

      default:
        throw this.createUnknownMethodException(this.sortingMethod);
    }
  }

  private static toSortedList<T>(values: T[], comparator: Comparator<T>): T[] {
    return [...values].sort(comparator.compare);
  }

  private createUnknownMethodException(sortingMethod: SortingMethod): RuntimeException {
    return new IllegalArgumentException(`Unsupported sorting method: ${sortingMethod}`);
  }
}
