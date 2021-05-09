const getNestedObject: (
  obj: Record<string, any>,
  ...keys: Array<string | number>
) => any = (obj, ...keys) => keys.reduce((acc, cur) => acc[cur], obj);

export default function createGlobalSelector<
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

export default function createGlobalSelector(
  selectorFuncsObj: Record<string, Function> | Function,
  ...sliceStructure: Array<string>
) {
  if (typeof selectorFuncsObj === 'function')
    return (state: Record<string, any>) =>
      selectorFuncsObj(getNestedObject(state, ...sliceStructure));
  return Object.fromEntries(
    Object.entries(selectorFuncsObj).map(([key, selectorFunc]) => [
      key,
      (state: Record<string, any>) =>
        selectorFunc(getNestedObject(state, ...sliceStructure)),
    ])
  );
}

// const { selectX, selectY, selectZ } = createGlobalSelector(
//   {
//     selectX: (state: Record<string, any>): number => state.x,
//     selectY: (state: Record<string, any>): number => state.y,
//     selectZ: (state: Record<string, any>): string => state.z,
//   },
//   'a',
//   'b'
// );

// const globalf = createGlobalSelector((state: any) => state.x, 'a', 'b');
// globalf({ a: 'kjh' });
