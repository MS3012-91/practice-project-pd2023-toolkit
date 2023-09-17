const { expect } = require('chai');
const { mapStringToValues } = require('../utils/functions');

describe(' Test Functions', () => {
  describe('Testing map string to values', () => {
    it('should return true:boolean where passed "true" ', () => {
      const result = mapStringToValues('true');
      expect(result).to.be.true;
    });
    it('should return false:boolean where passed "false" ', () => {
      const result = mapStringToValues('false');
      expect(result).to.be.false;
    });
    it('should return undefined:undefined where passed "undefined" ', () => {
      const result = mapStringToValues('undefined');
      expect(result).to.be.undefined;
    });
    it('should return null:null where passed "null" ', () => {
      const result = mapStringToValues('null');
      expect(result).to.be.null;
    });
    it('should return NaN where passed "NaN": string ', () => {
      const result = mapStringToValues('NaN');
      expect(result).to.be.NaN;
    });
    it('should return 4.1:number where passed "4.1":string ', () => {
      const result = mapStringToValues('4');
      expect(result).to.equal(4);
    });
    it('should return "4abc":string where passed "4abc":string  ', () => {
      const stringParam = '4abc';
      const result = mapStringToValues(stringParam);
      expect(result).to.equal(stringParam);
    });
    it('should return 4:number where passed "4":string ', () => {
      const result = mapStringToValues('4');
      expect(result).to.equal(4);
    });
    it('should return "qwerty":string where passed "qwerty":string ', () => {
      const stringParam = 'qwerty';
      const result = mapStringToValues(stringParam);
      expect(result).to.equal(stringParam);
    });
  });
});
