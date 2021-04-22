import * as P from 'maasglobal-prelude-ts';

import * as ruins from 'ruins-ts';

import { fpSendSms, ooSendSms } from '../index';

describe('main exports', () => {
  const realLog = console.log;
  const fakeLog = jest.fn();
  beforeEach(() => {
    // eslint-disable-next-line fp/no-mutation
    console.log = fakeLog;
  });
  afterEach(() => {
    fakeLog.mockReset();
    // eslint-disable-next-line fp/no-mutation
    console.log = realLog;
  });

  describe('fpSendSms function', () => {
    it('should work', async () => {
      const main = P.pipe('Hello world!', fpSendSms('+3581234567'));
      await ruins.fromTaskEither(main);
      expect(fakeLog.mock.calls).toEqual([['sending to +3581234567: Hello world!']]);
    });
  });

  describe('ooSendSms procedure', () => {
    it('should work', async () => {
      await ooSendSms('+3581234567', 'Hello world!');
      expect(fakeLog.mock.calls).toEqual([['sending to +3581234567: Hello world!']]);
    });
  });
});
