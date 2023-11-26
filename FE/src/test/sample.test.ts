const sum = (a: number, b: number): number => a + b;

test('샘플 테스트 실행', () => {
  expect(sum(1, 2)).toBe(3);
});
