import { sum } from '../readme';

describe('README.md', () => {
  describe('sum function', () => {
    it('should calculate sum of two numbers', () => {
      expect(sum(2, 3)).toEqual(5);
    });
  });
});
