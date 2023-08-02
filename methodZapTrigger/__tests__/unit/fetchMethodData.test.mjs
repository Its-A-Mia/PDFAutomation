import { fetchMethodData } from '../../index.mjs';

const snapshot = {
  count: expect.any(Number),
  value: expect.any(Array),
};

describe('fetchMethodData function', () => {
  it('grabs invoice entries with a balance due', async () => {
    const data = await fetchMethodData();
    expect(data).toMatchSnapshot(snapshot);
  });
});
