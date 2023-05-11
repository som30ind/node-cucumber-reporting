import { readJsonSync } from 'fs-extra';
import { statSync } from 'node:fs';
import { basename } from 'node:path';
import { Configuration } from './Configuration';
import { IFeature } from '../types/report.type';
import { JsonParseException, JsonParseExceptionCode } from '../types/utility.type';
import { Helper } from './helpers/Helper';
import { MFeature } from './json/Feature';
import { globSync } from 'glob';

export class ReportParser {
  constructor(
    private readonly configuration: Configuration
  ) { }

  /**
   * Parsed passed files and extracts features files.
   *
   * @param jsonFiles JSON files to read
   * @return array of parsed features
   */
  public parseJsonFiles(jsonFiles: string[]): MFeature[] {
    if (!Array.isArray(jsonFiles) || jsonFiles.length === 0) {
      throw new JsonParseException(JsonParseExceptionCode.NO_INPUT_FILES, 'No JSON report file was found!');
    }

    const featureResults = jsonFiles
      .map(fileExpr => globSync(fileExpr))
      .flat()
      .reduce((t, jsonFile) => {
        // if file is empty (is not valid JSON report), check if should be skipped or not
        if (statSync(jsonFile).size == 0 && this.configuration.reducingMethods.includes('SKIP_EMPTY_JSON_FILES')) {
          return t;
        }

        // This logic ensures that there is not duplicate files are parsed.
        if (t.uniqueFiles[jsonFile] !== undefined) {
          t.uniqueFiles[jsonFile]++;

          return t;
        }

        t.uniqueFiles[jsonFile] = 0;
        const features = this.parseForFeature(jsonFile);
        console.info(`File '${jsonFile}' contains ${features.length} feature(s)`);
        t.results.push(...features);

        return t;
      }, { results: [] as MFeature[], uniqueFiles: {} as Record<string, number> }).results;

    // report that has no features seems to be not valid
    if (featureResults.length === 0) {
      throw new JsonParseException(JsonParseExceptionCode.NO_FEATURES, 'Passed files have no features!');
    }

    return featureResults;
  }

  /**
   * Reads passed file and returns parsed features.
   *
   * @param jsonFile JSON file that should be read
   * @return array of parsed features
   */
  private parseForFeature(jsonFile: string): MFeature[] {
    const jFeatures = readJsonSync(jsonFile) as IFeature[];

    if (!Array.isArray(jFeatures) || jFeatures.length === 0) {
      console.info(`File '${jsonFile}' does not contain features`);
    }

    const jsonFileName = basename(jsonFile.toLowerCase(), '.json');

    return jFeatures.map(jFeature => {
      MFeature
      const mFeature = MFeature.fromJson(jFeature, this.configuration);
      mFeature.qualifier = this.configuration.qualifiers[jsonFileName] ?? jsonFileName;

      return mFeature;
    });
  }

  /**
   * Parses passed properties files for classifications. These classifications within each file get added to the overview-features page as metadata.
   * File and metadata order within the individual files are preserved when classifications are added.
   *
   * @param jsonPropFiles property files to read
   */
  public parseClassificationsFiles(jsonPropFiles: string[]): void {
    if (jsonPropFiles.length > 0) {
      for (const jsonPropFile of jsonPropFiles) {
        if (jsonPropFile) {
          this.processClassificationFile(jsonPropFile);
        }
      }
    }
  }

  private processClassificationFile(file: string): void {
    const config = readJsonSync(file);
    Helper.mergeDeep(this.configuration.classifications, config);
  }
}
