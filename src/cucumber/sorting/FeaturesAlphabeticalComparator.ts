import { Comparator } from '../../types/utility.type';
import { MFeature } from '../json/Feature';

export class FeaturesAlphabeticalComparator implements Comparator<MFeature> {
  public compare(feature1: MFeature, feature2: MFeature): number {
    // order by the name so first compare by the name
    const nameCompare = (feature1?.name ?? '').localeCompare((feature2?.name ?? ''));

    if (nameCompare !== 0) {
      return nameCompare;
    }

    // if names are the same, compare by the ID which should be unieque by JSON file
    const idCompare = (feature1?.id ?? '').localeCompare((feature2?.id ?? ''));

    if (idCompare !== 0) {
      return idCompare;
    }

    // if ids are the same it means that feature exists in more than one JSON file so compare by JSON report
    return (feature1?.reportFileName ?? '').localeCompare((feature2?.reportFileName ?? ''));
  }
}
