import { describe, expect, it } from '@jest/globals';

import { TreeNode } from './TreeNode';

describe('TreeNode', () => {
  const treeNodeInstance: {
    key: string;
    value: string;
  }[] = [
      { key: 'A', value: 'AA' },
    ];

  for (const { key, value } of treeNodeInstance) {
    it(`Should be able to get TreeNode(${key}, ${value})`, () => {
      const m = new TreeNode<string, string>(key, value);
      expect(m.key).toEqual(key);
      expect(m.value).toEqual(value);
    });
  }
});
