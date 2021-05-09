declare type DataSubscription<TValue = any, TKey = any> =
{
    readonly path: string;
    onAdd(item: TValue, key: TKey): void;
    onRemove(item: TValue, key: TKey): void;
}