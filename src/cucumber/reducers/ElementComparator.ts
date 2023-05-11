import { Comparator } from '../../types/utility.type';
import { Helper } from '../helpers/Helper';
import { MElement } from '../json/Element';

/**
 * Compares two elements and shows if they have the same Id for scenario type
 * or they are on the same line if it's a background.
 */
export class ElementComparator implements Comparator<MElement> {
  /**
   * @return comparison result of Ids or line numbers if elements have the same type
   * or -1 if type of elements is different.
   */
  public compare(element1: MElement, element2: MElement): number {
    if (this.hasSameType(element1, element2)) {
      if (element1.isScenario()) {
        return this.nullsFirstCompare(element1.id, element2.id, {
          compare: Helper.compareIgnoreCase
        });
      }

      /*
       * Compares non-scenario elements, like Background.
       */
      return this.nullsFirstCompare(element1.line, element2.line, {
        compare(a: number, b: number): number {
          return a - b;
        }
      });
    }

    return -1;
  }

  private hasSameType(element1: MElement, element2: MElement): boolean {
    return element1 !== undefined && element2 !== undefined &&
      Helper.equalsIgnoreCase(element1.type, element2.type);
  }

  private nullsFirstCompare<T>(a: T | undefined, b: T | undefined, comparator: Comparator<T>): number {
    if (a === undefined && b === undefined) {
      return 0;
    } else if (a === undefined || a === null) {
      return -1;
    } else if (b === undefined || b === null) {
      return 1;
    } else {
      return comparator.compare(a, b);
    }
  }
}
