import { expect, it, describe } from '@jest/globals';
import { Counter } from './Counter';

describe('Counter', () => {
  it('Should be able to create Counter instance', () => {
    const counter = new Counter();
    expect(counter).not.toBeUndefined();
  });

  it('Should be able to call next() method multiple times to get incremented values.', () => {
    const counter = new Counter();

    for (let i = 1; i <= 5; i++) {
      expect(counter.next()).toBe(i);
    }
  });
});
