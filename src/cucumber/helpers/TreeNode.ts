export class TreeNode<K, V> {
  public left: TreeNode<K, V> | undefined;
  public right: TreeNode<K, V> | undefined;

  constructor(
    public readonly key: K,
    public value: V
  ) { }
}
