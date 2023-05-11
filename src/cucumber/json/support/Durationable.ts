export interface Durationable {
  /**
   * Returns duration for given item.
   *
   * @return duration
   */
  getDuration(): number;

  /**
   * Returns duration displayed in humanable format.
   *
   * @return formatted duration
   */
  getFormattedDuration(): string;
}
