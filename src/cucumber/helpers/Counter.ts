export class Counter {
  private counter = 0;

  public next(): number {
    return ++this.counter;
  }
}
