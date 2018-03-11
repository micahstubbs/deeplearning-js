import batchTrain from './batchTrain';

test('batchTrain', () => {
  const ro = batchTrain(
    0,
    5,
    2,
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    [[1, 1, 0]],
    {
      W1: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
      b1: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      activation1: 'relu',
      W2: [[1, 1, 1]],
      b2: [[0, 0, 0]],
      activation2: 'sigmoid',
    },
    0.03,
    "cross-entropy",
    () => {},
    ro => ro,
    [],
    true,
  );
  expect(ro.costs).toEqual([
    3.000123402189504,
    2.6112993361643206,
    2.2634923501488093,
    1.9522370410706715,
    1.6741966014084741,
    1.4273654529762976,
    1.2112272360794873,
    1.0266546710450892,
    0.8752341427456866,
    0.7578391708033904,
  ]);
});