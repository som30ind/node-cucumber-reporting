import { isValid, parseISO } from 'date-fns';
import { cloneDeep, isInteger, isObject, isString, mergeWith } from 'lodash';
import { createHash, randomBytes } from 'node:crypto';
import { Configuration, UserConfiguration } from '../Configuration';
import { IHasContent } from '../json/support/IHasContent';
import { DurationFormatter } from './DurationFormatter';

export class Helper {
  private static readonly percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private static readonly decimalFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // private static readonly timeFormatter = new Intl.DateTimeFormat('en-US', {
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric',
  //   fractionalSecondDigits: 3,
  // });

  // public static stringToUnion<R>(allowedOptions: readonly R[], option: string | undefined, defaultOption: R): R {
  //   const selectedOption: R | undefined = allowedOptions.find(opt => opt === option);

  //   if (selectedOption === undefined) {
  //     return defaultOption;
  //   }

  //   return selectedOption;
  // }

  public static mapJsonArray<U, T>(configuration: Configuration, jsonData: U[] | undefined, mappingFunction: (configuration: Configuration, el: U) => T): T[] {
    if (!Array.isArray(jsonData)) {
      return [];
    }

    return jsonData.map(d => mappingFunction(configuration, d));
  }

  public static mapJson<U, T>(configuration: Configuration, jsonData: U | undefined, mappingFunction: (configuration: Configuration, el: U) => T): T | undefined {
    if (jsonData === undefined) {
      return;
    }

    return mappingFunction(configuration, jsonData);
  }

  public static isOptionalString(value: any) {
    if (value === undefined) {
      return true;
    }

    return isString(value);
  }

  public static isOptionalInteger(value: any) {
    if (value === undefined) {
      return true;
    }

    return isInteger(value);
  }

  public static isStringArray(values: any) {
    return Array.isArray(values) && values.every(c => isString(c));
  }

  public static isIntegerArray(values: any) {
    return Array.isArray(values) && values.every(c => isInteger(c));
  }

  public static parseDate(value: string | undefined): Date | undefined {
    if (value === undefined) {
      return undefined;
    }

    const date = parseISO(value);

    if (!isValid(date)) {
      return undefined;
    }

    return date;
  }

  public static mergeDeep(source: Record<string, any>, target: Record<string, any>) {
    mergeWith(source, target, (srcValue: any, targetValue: any) => {
      if (Array.isArray(srcValue)) {
        return srcValue.concat(targetValue);
      } else if (isObject(srcValue)) {
        return Helper.mergeDeep(srcValue, targetValue);
      }

      return targetValue !== undefined ? targetValue : srcValue;
    });
  }

  // public static mergeConfigs(defaultConfig: Configuration, userConfig: Partial<UserConfiguration>): Configuration {
  //   const mergedConfig = cloneDeep(defaultConfig);

  //   Helper.mergeDeep(mergedConfig, userConfig);

  //   return mergedConfig;
  // }

  public static equalsIgnoreCase(a: string | undefined, b: string | undefined): boolean {
    return (a ?? '').toUpperCase() === (b ?? '').toUpperCase();
  }

  public static compareIgnoreCase(a: string | undefined, b: string | undefined): number {
    return (a ?? '').toLowerCase().localeCompare((b ?? '').toLowerCase());
  }

  public static formatDuration(duration: number): string {
    return DurationFormatter.format(duration);
  }

  /**
   * Returns value converted to percentage format.
   *
   * @param value value to convert
   * @param total sum of all values
   * @return converted values including '%' character
   */
  public static formatAsPercentage(value: number, total: number): string {
    const average = total === 0 ? 0 : value / total;
    return Helper.percentFormatter.format(average);
  }

  public static formatAsDecimal(value: number, total: number): string {
    const average = total === 0 ? 0 : (100 * value) / total;
    return Helper.decimalFormatter.format(average);
  }

  /**
   * Converts characters of passed string and replaces to hash which can be treated as valid file name.
   *
   * @param fileName sequence that should be converted
   * @return converted string
   */
  public static toValidFileName(fileName: string): string {
    return Helper.generateHashCode(fileName);
  }

  /**
   * Helper method that removes empty hooks from passed array and packs it into new collection.
   *
   * @param hooks hooks to be reduced
   * @return no empty hooks
   */
  public static eliminateEmptyHooks(hooks: IHasContent[]): IHasContent[] {
    return hooks.filter(hook => hook.hasContent());
  }

  public static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Splits a string into an array of individual characters (each a String).
   * splitIntoCharacters('Text') = ['T', 'e', 'x', 't']
   */
  public static splitIntoCharacters(str: string): string[] {
    return str.split('');
  }

  public static escapeChars(chars: string[]): string[] {
    return chars.map(c => Helper.escapeHtml(c));
  }

  public static generateHashCode(str: string): string {
    const hash = createHash('sha256');
    hash.update(str);

    return hash.digest('hex');
  }

  public static generateRandomNumber() {
    const randomNumber = randomBytes(4).readUInt32BE(0);

    return randomNumber.toString();
  }
}
