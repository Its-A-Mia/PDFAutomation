import { invokeZapierTrigger } from '../../index.mjs';

/////////////////////
// @params
// staleValues
/////////////////////

const testStaleValues = [
  {
    RecordID: 0,
    Email: 'test@email.com',
    SalesRep: 'ME',
    Amount: 555.55,
    RefNumber: '99999',
    isDeleted: false,
  },
];

describe('invokeZapierTrigger function', () => {
  it('calls the Zap to run -- will not run if recordID returns a deleted entry', async () => {
    const response = await invokeZapierTrigger(testStaleValues);
    expect(response).toBe();
  });
});
