import { IArg } from '../../types/report.type';
import { Helper } from './Helper';

export class StepHelper {
  public static format(stepName: string, args: IArg[], preArgument: string, postArgument: string): string {
    if (!Array.isArray(args) || args.length === 0) {
      return Helper.escapeHtml(stepName);
    }

    let chars: string[] = Helper.splitIntoCharacters(stepName);

    chars = Helper.escapeChars(chars);
    StepHelper.surroundArguments(args, preArgument, postArgument, chars);

    return chars.join('');
  }

  private static surroundArguments(args: IArg[], preArgument: string, postArgument: string, chars: string[]): void {
    for (const arg of args) {
      if (!StepHelper.isValidArgument(arg)) {
        continue;
      }

      const start = arg.offset as number;
      const end = start + (arg.val as string).length - 1;

      chars[start] = preArgument + chars[start];
      chars[end] = chars[end] + postArgument;
    }
  }

  private static isValidArgument(arg: IArg): boolean {
    return arg.offset !== undefined && (arg.val ?? '').length > 0;
  }
}
