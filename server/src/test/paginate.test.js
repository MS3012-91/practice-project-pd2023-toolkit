const { expect } = require('chai');
const { paginateTest } = require('.././utils/functions');

describe('pagination pages', () => {
  it('should return default offset', () => {
    const result = paginateTest({query: { results: 5 }});
    expect(result).to.deep.equal({ offset: 0, limit: 5 });
  });

  it('should return default limit', () => {
    const result = paginateTest({ query: { page: 5 } });
    expect(result).to.deep.equal({ offset: 40, limit: 10 });
  });
    
  it('should return full users pagination', () => {
    const result = paginateTest({ query: { page: 2, results: 5 } });
    expect(result).to.deep.equal({ offset: 5, limit: 5 });
  });
});
