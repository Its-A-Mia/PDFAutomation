import { getCompareData } from '../../index.mjs';

// requires AWS credentials

const snapshot = {
  count: expect.any(Number),
  value: expect.any(Array),
};

describe('getCompareData function', () => {
  it('grabs compare data from a .json file within an S3 bucket', async () => {
    const data = await getCompareData();
    expect(data).toMatchSnapshot(snapshot);
  });
});
