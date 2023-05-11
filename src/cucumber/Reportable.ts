import { ReportStatus } from './json/support/ReportStatus';


export interface Reportable {
  /**
   * @return name of the element that will be displayed to user.
   */
  getName(): string;

  /**
   * @return number of features for this element.
   */
  getFeatures(): number;

  /**
   * @return number of passed features for this element.
   */
  getPassedFeatures(): number;

  /**
   * @return number of failed features for this element.
   */
  getFailedFeatures(): number;

  /**
   * @return number of scenarios for this element.
   */
  getScenarios(): number;

  /**
   * @return number of passed scenarios for this element.
   */
  getPassedScenarios(): number;

  /**
   * @return number of failed scenarios for this element.
   */
  getFailedScenarios(): number;

  /**
   * @return number of all steps for this element.
   */
  getSteps(): number;

  /**
   * @return number of passed steps for this element.
   */
  getPassedSteps(): number;

  /**
   * @return number of failed steps for this element.
   */
  getFailedSteps(): number;

  /**
   * @return number of skipped steps for this element.
   */
  getSkippedSteps(): number;

  /**
   * @return number of undefined steps for this element.
   */
  getUndefinedSteps(): number;

  /**
   * @return number of pending steps for this element.
   */
  getPendingSteps(): number;

  /**
   * @return duration as milliseconds for this element.
   */
  getDuration(): number;

  /**
   * @return formatted duration for this element.
   */
  getFormattedDuration(): string;

  /**
   * @return status for this element.
   */
  getStatus(): ReportStatus;
}
