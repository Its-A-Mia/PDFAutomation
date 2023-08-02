import { fetchEmail } from '../../index.mjs';

const snapshot = {
  Email: expect.any(String),
};

const customerRecordID = 1140;

const result = {
  Email: 'result@email.com',
};

describe('fetchEmail function', () => {
  it('grabs email from a customer account', async () => {
    const data = await fetchEmail(customerRecordID);
    expect(data).toStrictEqual(snapshot);
  });
});
