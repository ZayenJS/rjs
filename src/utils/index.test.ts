import { hasNoOptions } from '.';

it('Should return true if object is empty', () => {
  expect(hasNoOptions({})).toBe(true);
  expect(hasNoOptions({ test: 123 })).toBe(false);
});

export default {};
