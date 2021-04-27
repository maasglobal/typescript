import * as P from 'maasglobal-prelude-ts';

import { divide } from '../readme';

describe('README.md', () => {
  describe('divide function', () => {
    it('should divide piped value with argument', () => {
      expect(P.pipe(8, divide(2))).toEqual(P.Either_.right(4));
    });
  });
});
