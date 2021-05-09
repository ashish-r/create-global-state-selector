const getNestedObject: (
  obj: Record<string, any>,
  ...keys: Array<string | number>
) => any = (obj, ...keys) => keys.reduce((acc, cur) => acc[cur], obj);

export default function createGlobalStateSelector<
  T extends Record<keyof T, (arg: any) => any> | Function
>(
  selectorFuncsObj: T,
  ...sliceStructure: Array<string>
): T extends (arg: Record<string, any>) => infer R
  ? (arg: Record<string, any>) => R
  : {
      [K in keyof T]: T[K] extends (arg: Record<string, any>) => infer R
        ? (arg: Record<string, any>) => R
        : never;
    };

export default function createGlobalStateSelector(
  selectors: Record<string, Function> | Function,
  ...sliceStructure: Array<string>
) {
  if (typeof selectors === 'function')
    return (state: Record<string, any>) =>
      selectors(getNestedObject(state, ...sliceStructure));
  return Object.fromEntries(
    Object.entries(selectors).map(([key, selectorFunc]) => [
      key,
      (state: Record<string, any>) =>
        selectorFunc(getNestedObject(state, ...sliceStructure)),
    ])
  );
}
