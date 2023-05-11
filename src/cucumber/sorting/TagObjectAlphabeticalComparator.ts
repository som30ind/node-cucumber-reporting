import { Comparator } from '../../types/utility.type';
import { TagObject } from '../json/support/TagObject';

export class TagObjectAlphabeticalComparator implements Comparator<TagObject> {
  public compare(tagObject1: TagObject, tagObject2: TagObject): number {
    // since there might be the only one TagObject with given tagName, compare by location only
    return (tagObject1.getName() ?? '').localeCompare((tagObject2.getName() ?? ''));
  }
}
