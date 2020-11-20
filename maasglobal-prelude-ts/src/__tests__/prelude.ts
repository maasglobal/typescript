import * as ruins from 'ruins-ts';

import * as P from '../prelude';

describe('prelude ', () => {
  describe('void essentials', () => {
    it('should contain void utilities', () => {
      const log = jest.fn();
      const hello: P.IO<void> = () => log('hello');
      const greeter: P.IO<void> = P.pipe(
        [hello, hello], // Array<IO<void>>
        P.Array__.sequence(P.IO__), // IO<Array<void>>
        P.IO_.map(P.void_.fromArray), // IO<void>
      );
      greeter(); // void
      expect(log.mock.calls).toEqual([['hello'], ['hello']]);
    });
  });

  describe('Array essentials', () => {
    it('should contain array constructor', () => {
      const example: Array<number> = P.array(1, 2, 3);
      expect(example).toEqual([1, 2, 3]);
    });
    it('should contain array codec', () => {
      const parsed: Array<number> = ruins.fromEither(P.Array(P.number).decode([1, 2, 3]));
      expect(parsed).toEqual([1, 2, 3]);
    });
    it('should contain array utilities', () => {
      const mapped: Array<number> = P.pipe(
        [1, 2, 3],
        P.Array_.map((x) => 2 * x),
      );
      expect(mapped).toEqual([2, 4, 6]);
    });
    it('should contain array interfaces', () => {
      const sequenced: Array<{ foo: string; bar: number }> = P.pipe(
        {
          foo: ['a', 'b'],
          bar: [1, 2],
        },
        P.Apply_.sequenceS(P.Array__),
      );
      expect(sequenced).toEqual([
        {
          foo: 'a',
          bar: 1,
        },
        {
          foo: 'a',
          bar: 2,
        },
        {
          foo: 'b',
          bar: 1,
        },
        {
          foo: 'b',
          bar: 2,
        },
      ]);
    });
  });
});
