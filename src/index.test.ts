import createGlobalStateSelector from './';

describe('createGlobalStateSelector', () => {
  const store = { a: { b: { x: 55, y: 65, z: 'temp' } } };
  it('should return object of global selector functions', () => {
    const { selectX, selectY, selectZ } = createGlobalStateSelector(
      {
        selectX: (state: Record<string, any>): number => state.x,
        selectY: (state: Record<string, any>): number => state.y,
        selectZ: (state: Record<string, any>): string => state.z,
      },
      'a',
      'b'
    );
    expect(selectX(store)).toBe(55);
    expect(selectY(store)).toBe(65);
    expect(selectZ(store)).toBe('temp');
  });

  it('should return a global selector function', () => {
    const selectX = createGlobalStateSelector(
      (state: Record<string, any>): number => state.x,
      'a',
      'b'
    );
    expect(selectX(store)).toBe(55);
  });
});
