import { isPlainObject } from 'lodash';
import { JsonParseException, JsonParseExceptionCode } from '../types/utility.type';
import { Reportable } from './Reportable';

export interface ITrends {
  buildNumbers: string[];
  passedFeatures: number[];
  failedFeatures: number[];
  totalFeatures: number[];
  passedScenarios: number[];
  failedScenarios: number[];
  totalScenarios: number[];
  passedSteps: number[];
  failedSteps: number[];
  skippedSteps: number[];
  pendingSteps: number[];
  undefinedSteps: number[];
  totalSteps: number[];
  durations: number[];
}

export class Trends {
  private constructor(
    private pBuildNumbers: string[],
    private pPassedFeatures: number[],
    private pFailedFeatures: number[],
    private pTotalFeatures: number[],
    private pPassedScenarios: number[],
    private pFailedScenarios: number[],
    private pTotalScenarios: number[],
    private pPassedSteps: number[],
    private pFailedSteps: number[],
    private pSkippedSteps: number[],
    private pPendingSteps: number[],
    private pUndefinedSteps: number[],
    private pTotalSteps: number[],
    private pDurations: number[],
  ) { }

  private static validateArray<T>(arr: T[] | undefined): T[] {
    if (!Array.isArray(arr)) {
      return [];
    }

    return arr;
  }

  public static defaultObject() {
    return Trends.fromJson({} as ITrends);
  }

  public static fromJson(jsonData: ITrends) {
    if (!isPlainObject(jsonData)) {
      throw new JsonParseException(JsonParseExceptionCode.INVALID_JSON_INPUT, 'Invalid JSON Input. IOutput object expected.');
    }

    return new Trends(
      Trends.validateArray(jsonData.buildNumbers),
      Trends.validateArray(jsonData.passedFeatures),
      Trends.validateArray(jsonData.failedFeatures),
      Trends.validateArray(jsonData.totalFeatures),
      Trends.validateArray(jsonData.passedScenarios),
      Trends.validateArray(jsonData.failedScenarios),
      Trends.validateArray(jsonData.totalScenarios),
      Trends.validateArray(jsonData.passedSteps),
      Trends.validateArray(jsonData.failedSteps),
      Trends.validateArray(jsonData.skippedSteps),
      Trends.validateArray(jsonData.pendingSteps),
      Trends.validateArray(jsonData.undefinedSteps),
      Trends.validateArray(jsonData.totalSteps),
      Trends.validateArray(jsonData.durations),
    );
  }

  public toJson(): ITrends {
    return {
      buildNumbers: this.pBuildNumbers,
      passedFeatures: this.pPassedFeatures,
      failedFeatures: this.pFailedFeatures,
      totalFeatures: this.pTotalFeatures,
      passedScenarios: this.pPassedScenarios,
      failedScenarios: this.pFailedScenarios,
      totalScenarios: this.pTotalScenarios,
      passedSteps: this.pPassedSteps,
      failedSteps: this.pFailedSteps,
      skippedSteps: this.pSkippedSteps,
      pendingSteps: this.pPendingSteps,
      undefinedSteps: this.pUndefinedSteps,
      totalSteps: this.pTotalSteps,
      durations: this.pDurations,
    };
  }

  public get buildNumbers(): string[] {
    return this.pBuildNumbers;
  }

  public get passedFeatures(): number[] {
    return this.pPassedFeatures;
  }

  public get failedFeatures(): number[] {
    return this.pFailedFeatures;
  }

  public get totalFeatures(): number[] {
    return this.pTotalFeatures;
  }

  public get passedScenarios(): number[] {
    return this.pPassedScenarios;
  }

  public get failedScenarios(): number[] {
    return this.pFailedScenarios;
  }

  public get totalScenarios(): number[] {
    return this.pTotalScenarios;
  }

  public get passedSteps(): number[] {
    return this.pPassedSteps;
  }

  public get failedSteps(): number[] {
    return this.pFailedSteps;
  }

  public get skippedSteps(): number[] {
    return this.pSkippedSteps;
  }

  public get pendingSteps(): number[] {
    return this.pPendingSteps;
  }

  public get undefinedSteps(): number[] {
    return this.pUndefinedSteps;
  }

  public get totalSteps(): number[] {
    return this.pTotalSteps;
  }

  public get durations(): number[] {
    return this.pDurations;
  }

  /**
   * Adds build into the trends.
   * @param buildNumber number of the build
   * @param reportable stats for the generated report
   */
  public addBuild(buildNumber: string, reportable: Reportable): void {
    this.pBuildNumbers.push(buildNumber);

    this.pPassedFeatures.push(reportable.getPassedFeatures());
    this.pFailedFeatures.push(reportable.getFailedFeatures());
    this.pTotalFeatures.push(reportable.getFeatures());

    this.pPassedScenarios.push(reportable.getPassedScenarios());
    this.pFailedScenarios.push(reportable.getFailedScenarios());
    this.pTotalScenarios.push(reportable.getScenarios());

    this.pPassedSteps.push(reportable.getPassedSteps());
    this.pFailedSteps.push(reportable.getFailedSteps());
    this.pSkippedSteps.push(reportable.getSkippedSteps());
    this.pPendingSteps.push(reportable.getPendingSteps());
    this.pUndefinedSteps.push(reportable.getUndefinedSteps());
    this.pTotalSteps.push(reportable.getSteps());

    this.pDurations.push(reportable.getDuration());

    // this should be removed later but for now correct features and save valid data
    this.applyPatchForFeatures();

    if (this.pPendingSteps.length < this.pBuildNumbers.length) {
      this.fillMissingSteps();
    }

    if (this.pDurations.length < this.pBuildNumbers.length) {
      this.fillMissingDurations();
    }
  }

  /**
   * Removes elements that points to the oldest items.
   * Leave trends unchanged if the limit is bigger than current trends length.
   *
   * @param limit number of elements that will be leave
   */
  public limitItems(limit: number): void {
    this.pBuildNumbers = Trends.copyLastElements(this.pBuildNumbers, limit);

    this.pPassedFeatures = Trends.copyLastElements(this.pPassedFeatures, limit);
    this.pFailedFeatures = Trends.copyLastElements(this.pFailedFeatures, limit);
    this.pTotalFeatures = Trends.copyLastElements(this.pTotalFeatures, limit);

    this.pPassedScenarios = Trends.copyLastElements(this.pPassedScenarios, limit);
    this.pFailedScenarios = Trends.copyLastElements(this.pFailedScenarios, limit);
    this.pTotalScenarios = Trends.copyLastElements(this.pTotalScenarios, limit);

    this.pPassedSteps = Trends.copyLastElements(this.pPassedSteps, limit);
    this.pFailedSteps = Trends.copyLastElements(this.pFailedSteps, limit);
    this.pSkippedSteps = Trends.copyLastElements(this.pSkippedSteps, limit);
    this.pPendingSteps = Trends.copyLastElements(this.pPendingSteps, limit);
    this.pUndefinedSteps = Trends.copyLastElements(this.pUndefinedSteps, limit);
    this.pTotalSteps = Trends.copyLastElements(this.pTotalSteps, limit);

    this.pDurations = Trends.copyLastElements(this.pDurations, limit);
  }

  private static copyLastElements<T>(srcArray: T[], copyingLimit: number): T[] {
    // if there is less elements than the limit then return array unchanged
    if (srcArray.length <= copyingLimit) {
      return srcArray;
    }

    return srcArray.slice(srcArray.length - copyingLimit);
  }

  /**
   * Due to the error with old implementation where total features
   * were passed instead of failures (and vice versa) following correction must be applied for trends generated
   * between release 3.0.0 and 3.1.0.
   */
  private applyPatchForFeatures(): void {
    for (let i = 0; i < this.pTotalFeatures.length; i++) {
      const total = this.pTotalFeatures[i];
      const failures = this.pFailedFeatures[i];

      if (total < failures) {
        // this data must be changed since it was generated by invalid code
        this.pTotalFeatures[i] = failures;
        this.pFailedFeatures[i] = total;
      }
    }
  }

  /**
   * Since pending and undefined steps were added later
   * there is need to fill missing data for those statuses.
   */
  private fillMissingSteps(): void {
    // correct only pending and undefined steps
    this.pPassedFeatures = this.fillMissingArray(this.pPassedFeatures);
    this.pPassedScenarios = this.fillMissingArray(this.pPassedScenarios);

    this.pPassedSteps = this.fillMissingArray(this.pPassedSteps);
    this.pSkippedSteps = this.fillMissingArray(this.pSkippedSteps);
    this.pPendingSteps = this.fillMissingArray(this.pPendingSteps);
    this.pUndefinedSteps = this.fillMissingArray(this.pUndefinedSteps);
  }

  private fillMissingArray(toExtend: number[]): number[] {
    if (toExtend.length >= this.pBuildNumbers.length) {
      return toExtend.slice(0, this.pBuildNumbers.length);
    }

    const extended = new Array<number>(this.pBuildNumbers.length).fill(0);
    extended.splice(this.pBuildNumbers.length - toExtend.length, toExtend.length, ...toExtend);

    return extended;
  }

  /**
   * Since durations were added later there is need to fill missing data for those statuses.
   */
  private fillMissingDurations(): void {
    const extended = new Array<number>(this.pBuildNumbers.length).fill(-1);
    extended.splice(this.pBuildNumbers.length - this.pDurations.length, this.pDurations.length, ...this.pDurations);

    this.pDurations = extended;
  }
}
