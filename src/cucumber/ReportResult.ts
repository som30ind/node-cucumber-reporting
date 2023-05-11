import { format } from 'date-fns';
import { Configuration } from './Configuration';
import { Reportable } from './Reportable';
import { OverviewReport } from './generators/OverviewReport';
import { TreeMap } from './helpers/TreeMap';
import { MElement } from './json/Element';
import { MFeature } from './json/Feature';
import { MResult } from './json/Result';
import { MTag } from './json/Tag';
import { ReportStatus } from './json/support/ReportStatus';
import { Resultsable } from './json/support/Resultable';
import { StepObject } from './json/support/StepObject';
import { TagObject } from './json/support/TagObject';
import { ReportFeatureMergerFactory } from './reducers/ReportFeatureMergerFactory';
import { SortingFactory } from './sorting/SortingFactory';

export class ReportResult {
  private allFeatures: MFeature[] = [];
  private allTags = new TreeMap<string, TagObject>();
  private allSteps = new TreeMap<string, StepObject>();

  /**
   * Time when this report was created.
   */
  private buildTime: string;
  private sortingFactory: SortingFactory;
  private mergerFactory = new ReportFeatureMergerFactory();

  private featuresReport = new OverviewReport();
  private tagsReport = new OverviewReport();

  public constructor(
    features: MFeature[],
    configuration: Configuration
  ) {
    this.buildTime = ReportResult.getCurrentTime();
    this.sortingFactory = new SortingFactory(configuration.sortingMethod);

    const mergedFeatures: MFeature[] = this.mergerFactory.get(configuration.reducingMethods).merge(features);

    for (let i = 0; i < mergedFeatures.length; i++) {
      mergedFeatures[i].setMetaData(i, configuration);
      this.processFeature(mergedFeatures[i]);
    }
  }

  public getAllFeatures(): MFeature[] {
    return this.sortingFactory.sortFeatures(this.allFeatures);
  }

  public getAllTags(): TagObject[] {
    return this.sortingFactory.sortTags(this.allTags.values());
  }

  public getAllSteps(): StepObject[] {
    return this.sortingFactory.sortSteps(this.allSteps.values());
  }

  public getFeatureReport(): Reportable {
    return this.featuresReport;
  }

  public getTagReport(): Reportable {
    return this.tagsReport;
  }

  public getBuildTime(): string {
    return this.buildTime;
  }

  private processFeature(feature: MFeature): void {
    this.allFeatures.push(feature);

    for (const element of feature.elements) {
      if (element.isScenario()) {
        this.featuresReport.incScenarioFor(element.getStatus());

        // all feature tags should be linked with scenario
        for (const tag of feature.tags ?? []) {
          this.processTag(tag, element, feature.getStatus());
        }
      }

      // all element tags should be linked with element
      for (const tag of element.tags ?? []) {
        // don't count tag for feature if was already counted for element
        if (!feature.tags?.includes(tag)) {
          this.processTag(tag, element, element.getStatus());
        }
      }

      const steps = element.steps;

      for (const step of steps) {
        this.featuresReport.incStepsFor(step.getResult().status);
        this.featuresReport.incDurationBy(step.getDuration());
      }

      this.countSteps(steps);
      this.countSteps(element.before);
      this.countSteps(element.after);
    }

    this.featuresReport.incFeaturesFor(feature.getStatus());
    this.tagsReport.incFeaturesFor(feature.getStatus());
  }

  private processTag(tag: MTag, element: MElement, status: ReportStatus): void {
    const tagObject = this.addTagObject(tag.name);

    // if this element was not added by feature tag, add it as element tag
    if (tagObject.addElement(element)) {
      this.tagsReport.incScenarioFor(status);

      const steps = element.steps;

      for (const step of steps) {
        this.tagsReport.incStepsFor(step.getResult().status);
        this.tagsReport.incDurationBy(step.getDuration());
      }
    }
  }

  private countSteps(steps: Resultsable[]): void {
    for (const step of steps) {
      const match = step.getMatch();

      // no match = could not find method that was matched to this step -> status is missing
      if (match != null) {
        const methodName = match.location;

        // location is missing so there is no way to identify step
        if (!!methodName) {
          this.addNewStep(step.getResult(), methodName);
        }
      }
    }
  }

  private addNewStep(result: MResult, methodName: string): void {
    let stepObject = this.allSteps.get(methodName);

    // if first occurrence of this location add element to the map
    if (!stepObject) {
      stepObject = new StepObject(methodName);
    }

    // happens that report is not valid - does not contain information about result
    stepObject.addDuration(result.duration, result.status);

    this.allSteps.put(methodName, stepObject);
  }

  private addTagObject(name: string): TagObject {
    let tagObject = this.allTags.get(name);

    if (tagObject == null) {
      tagObject = new TagObject(name);
      this.allTags.put(tagObject.getName(), tagObject);
    }

    return tagObject;
  }

  public static getCurrentTime(): string {
    return format(new Date(), 'dd MMM yyyy, HH:mm');
  }
}
