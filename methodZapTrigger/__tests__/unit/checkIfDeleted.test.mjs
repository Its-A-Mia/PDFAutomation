import { checkIfDeleted } from '../../index.mjs';

/////////////////////
// @key of Input
// RecordID,
/////////////////////

/////////////////////
// @params
// RecordID
/////////////////////

const testDeletedID = 400;

const testID = 435;

describe('checkIfDeleted function', () => {
  it('queries the Method API for the RecordID to see if it is deleted--this returns true', async () => {
    const isDeleted = await checkIfDeleted(testDeletedID);
    expect(isDeleted).toBe(true);
  });

  it('queries the Method API for the RecordID to see if it is deleted--this returns false', async () => {
    const isDeleted = await checkIfDeleted(testID);
    expect(isDeleted).toBe(false);
  });
});
