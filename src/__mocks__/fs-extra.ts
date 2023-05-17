import { jest } from '@jest/globals';
import { WriteFileOptions } from 'fs-extra';

export const outputFileSync = jest.fn((filePath: string, data: string | Buffer, options?: WriteFileOptions) => {
  // Implement your mock behavior here
});
