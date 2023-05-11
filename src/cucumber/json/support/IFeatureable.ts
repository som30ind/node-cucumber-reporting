import { Configuration } from '../../Configuration';
import { Reportable } from '../../Reportable';
import { MHook } from '../Hook';
import { MStep } from '../Step';
import { MTag } from '../Tag';
import { Durationable } from './Durationable';
import { ReportStatus } from './ReportStatus';

export interface IFeatureable extends Durationable, Reportable {
  readonly id: string;
  readonly name: string;
  readonly uri: string;
  readonly keyword: string;
  readonly elements: IElementable[];
  readonly tags: MTag[];
  readonly description?: string;
  readonly line?: number;
  reportFileName: string;
  qualifier: string;

  setMetaData(jsonFileNo: number, configuration: Configuration): void;
  addElements(newElements: IElementable[]): void;
}

export interface IElementable extends Durationable {
  readonly type: string;
  readonly keyword: string;
  readonly steps: MStep[];
  readonly before: MHook[];
  readonly after: MHook[];
  readonly id?: string;
  readonly name?: string;
  readonly description?: string;
  readonly line?: number;
  readonly startTimestamp?: Date;
  readonly tags?: MTag[];

  getStatus(): ReportStatus;
  getBeforeStatus(): ReportStatus;
  getAfterStatus(): ReportStatus;
  getStepsStatus(): ReportStatus;
  isScenario(): boolean;
  isBackground(): boolean;
  getFeature(): IFeatureable;
  setMetaData(feature: IFeatureable, configuration: Configuration): void;
}
