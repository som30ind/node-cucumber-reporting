import { TreeNode } from './TreeNode';

export class TreeMap<K, V> {
  private root: TreeNode<K, V> | undefined;

  public get size(): number {
    let size = 0;
    const stack: TreeNode<K, V>[] = [];
    let node = this.root;

    while (node || stack.length > 0) {
      while (node) {
        stack.push(node);
        node = node.left;
      }

      node = stack.pop()!;
      size++;
      node = node.right;
    }

    return size;
  }

  private insertNode(node: TreeNode<K, V> | undefined, key: K, value: V): TreeNode<K, V> {
    if (!node) {
      return new TreeNode(key, value);
    }

    const compare = this.compareKeys(key, node.key);

    if (compare === 0) {
      node.value = value;
    } else if (compare < 0) {
      node.left = this.insertNode(node.left, key, value);
    } else {
      node.right = this.insertNode(node.right, key, value);
    }

    return node;
  }

  public put(key: K, value: V): void {
    this.root = this.insertNode(this.root, key, value);
  }

  public get(key: K): V | undefined {
    let node = this.root;

    while (node) {
      const compare = this.compareKeys(key, node.key);

      if (compare === 0) {
        return node.value;
      } else if (compare < 0) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    return undefined;
  }

  private compareKeys(key1: K, key2: K): number {
    if (key1 < key2) {
      return -1;
    } else if (key1 > key2) {
      return 1;
    } else {
      return 0;
    }
  }

  public values(): V[] {
    const values: V[] = [];
    const stack: TreeNode<K, V>[] = [];
    let node = this.root;

    while (node || stack.length > 0) {
      while (node) {
        stack.push(node);
        node = node.left;
      }

      node = stack.pop()!;
      values.push(node.value);
      node = node.right;
    }

    return values;
  }
}
