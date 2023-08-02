import { formatSalesRep } from '../../index.mjs';

/////////////////////
// @opions SalesRep
/////////////////////

/////////////////////
// @params
// salesRepTag
/////////////////////

describe('formatSalesRep function', () => {
  it('returns Ebay Sales if given the inital ES', () => {
    expect(formatSalesRep('ME')).toBe('Mia Purdun');
  });

  //  Repeated for each sales rep
});
