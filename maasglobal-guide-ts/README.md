# MaaS Global Guide to TypeScript and Functional Programming

TypeScript has a relatively good [type system](https://typescriptlang.org/docs/) that lets the developer validate architectural decisions by describing them in the integrated type language. However, taking [full advantage](https://softwareengineering.stackexchange.com/questions/347402/how-do-the-type-systems-in-functional-languages-differ-from-those-in-oo-language/347426) requires maintaining referential transparency. This means avoiding mutations and constructing new immutable values with functional programming tools.

This guide attemps to explaing basics of working with a code base written in this manner. The guide covers basics of [type variables](https://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables), [io-ts](https://github.com/gcanti/io-ts/blob/master/README.md#implemented-types--combinators) and [fp-ts](https://gcanti.github.io/fp-ts/introduction/core-concepts.html) data structures.

## Adding Type Signatures

Consider the following tiny application that performs a dice roll with a single six-sided die.
The code is quite compact and there isn't much room for type signatures.

```typescript
function diceMain1() {
  console.log('rolled: ' + (1 + Math.floor(Math.random() * 6)));
}
```

Breaking the code into smaller independent parts will let us add more type signatures.
By moving parts of the code away from it's original context also increase the need for
static typing since the individual parts might otherwise become incompatible with each
other.

Applications typically consist of some pure functions and some impure procedures. The
pure functions work deterministicly producing the same output for the same inputs, and
do not have any side-effects such as logging or networking. The impure procedures are
free to be nondeterministic and can do any effects.

Pure functions are in general easier to work with since they don't depend on order
or amount of invocations. For example, you can safely cache the return value of a pure
function, or you can safely remove the cache and call it several times. Let's start
refactoring `diceMain1` by defining some primitive types and extracting parts that
can be easily turned into pure functions.

```typescript
// number x, 0 <= x < 1
type Ratio = number;

// amount of sides on a die
type Sides = number;

// a number printed on a die
type Roll = number;

// text to be displayed as part of the user interface
type Printable = string;

type RollFromRatio = (s: Sides) => (r: Ratio) => Roll;
type PrintableFromRoll = (r: Roll) => Printable;

const rollFromRatio: RollFromRatio = (sides) => (ratio) => 1 + Math.floor(ratio * sides);
const printableFromRoll: PrintableFromRoll = (roll) => `rolled: ${roll}`;
```

We can then proceed by breaking the remaining code into several impure procedures that
use the the pure library functions from above to implement the same application in a more
structured manner.

```typescript
type RollDie = (s: Sides) => Roll;
type LogRoll = (r: Roll) => void;
type Main2 = () => void;

const rollDie: RollDie = (sides) => {
  const ratio = Math.random();
  return rollFromRatio(sides)(ratio);
};
const logRoll: LogRoll = (roll) => {
  console.log(printableFromRoll(roll));
};

const diceMain2: Main2 = () => {
  logRoll(rollDie(6));
};
```

In the example above `rollDie` procedure is impure because it contains a random element
and therefore produces different results for the same input. The `logRoll` procedure is
impure because it causes logging to happen. It's result clearly depends on when, and how
many times, the computation is executed. Finally, `diceMain2` is obviously impure since
it does both random and logging.

In order to minimize the amount of impure procedures, it is possible to split them into
two parts -- a pure function that takes arguments and produces an impure computation
with no arguments. This way the caller can decide wether or not they wish to execute
the computation and deal with the effects and nondeterminism. Below is the same
code example restructured in this manner.

```typescript
// impure computation that returns T
type IO<T> = () => T;

// pure functions
type RollDie3 = (s: Sides) => IO<Roll>;
type LogRoll3 = (r: Roll) => IO<void>;

type Main3 = IO<void>;

const rollDie3: RollDie3 = (sides) => {
  const fr = rollFromRatio(sides);
  return () => {
    const ratio = Math.random();
    return fr(ratio);
  };
};

const logRoll3: LogRoll3 = (roll) => {
  const printable = printableFromRoll(roll);
  return () => {
    console.log(printable);
  };
};

const rollSixSided3 = rollDie3(6);

const diceMain3: Main3 = () => {
  const roll = rollSixSided3();
  const logger = logRoll3(roll);
  logger();
};
```

We can use tooling from a functional programming library such as fp-ts to hide
some of the complexity related to combining individual IO thunks into a single
application. Below is one more iteration of the same code example but this time
none of the IO thunks are visible in the apllication source code. Note however,
that the types match those from the previous iteration.

```typescript
import { log } from 'fp-ts/Console';
import { flow, pipe } from 'fp-ts/function';
import { chain, map } from 'fp-ts/IO';
import { random } from 'fp-ts/Random';

const rollDie4: RollDie3 = (sides) => pipe(random, map(rollFromRatio(sides)));

const logRoll4: LogRoll3 = flow(printableFromRoll, log);

const rollSixSided4 = rollDie4(6);

const diceMain4: Main3 = pipe(rollSixSided4, chain(logRoll4));
```

## Type Variables

TypeScript throws away the types of your function inputs by default.
You can preserve the types by annotating your function with type variables.

```typescript
function createPair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}
```

Above we defined the types in the function definition but it is also ok
to define the types for the const that contains the function. As long
as TypeScript can infer the types you should be ok. Please note how `a`
and `b` are meaningless in the example below but are still required in
the code.

```typescript
type PairCreator = <A, B>(a: A, b: B) => [A, B];
const createPair2: PairCreator = (first, second) => [first, second];
```

Note that types `A` and `B` in the example above only support operations
that can be performed regardless of the more detailed types of the
inputs `a` and `b`. You may need to extend the signature if you wish to
perform operations. For example if you wish to perform numeric
multiplication or summation on `A` you would need to state `A extends number`.

```typescript
const double = <A extends number>(a: A) => a * 2;
const increment = <A extends number>(a: A) => a + 1;
```

## Pipeline

The code base makes heavy use of pipelines. Pipelines are the Javascript equivalent for UNIX pipes (the `ls|grep omg` sort of thing). The [pipeline operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator) `|>` is an upcoming starndard. TypeScript is currently [waiting](https://github.com/microsoft/TypeScript/issues/17718) for TC39 standardization. However, fp-ts provides a similar `pipe` function that works today. It works as follows.

```typescript
// import { pipe } from 'fp-ts/lib/function';

pipe(5, double, double, increment, double); // 42
```

When debugging runtime errors it may be desirable to add debug prints into a pipe using console.log. The type language does not contain print statement. However, identity functions with type signatures can be used to check the types where console.log lines are used to check runtime values.

```typescript
pipe(
  5,
  double,
  (x) => {
    console.log(x);
    return x;
  }, // check value
  double,
  (x: number) => x, // check type
  increment,
  double,
);
```

## Decoding JSON

Another situation where the type information is lost is when we convert
our data structures to JSON. Or the data might not have types to begin
if we read it from some external source. We use io-ts for such types
since this provides us with the type signature but also a matching
runtime validator.

In the example below we define io-ts data type user with the static
type `type User = ` and runtime validator `const User = `. The static
type is equivalent to `{ userId: number, name: string }`.

```typescript
import * as t from 'io-ts';

const User = t.type({
  userId: t.number,
  name: t.string,
});
type User = t.TypeOf<typeof User>;
```

In the example below we pass a json structure to the runtime validator.

```typescript
import { validator } from 'io-ts-validator';

const json: unknown = JSON.parse('{"userId":123,"name":"Bob"}');

const user: User = validator(User).decodeSync(json);
```

## Type Friendly Tooling

When working with types cstandard JavaScript tools are often too generic. TypeScript supports modifying the types with explicit [type assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions). However, using proper tooling may reduce the need to use explicit type casts.

We have collected some of the most basic utilities from typescript,
fp-ts and io-ts into maasglobal-prelude-ts package to make their
use more convenient.

lets import the tools under name `P` for easy access

```typescript
import * as P from 'maasglobal-prelude-ts';
```

Below are some examples cases where we can use the utilities to our benefit.

### Adding an Element to a Record

```typescript
const input1: Record<string, string> = {
  foo: 'foo',
};

const output1a: Record<string, number> = {
  ...input1, // string becomes number :(
  omg: 123,
};

const output1b: Record<string, number> = P.pipe(
  // @ts-expect-error   error detected :)
  input1,
  P.Record_.upsertAt('omg', 123),
);
```

### Concatenating Arrays of Different Type

```typescript
const input3: Array<number> = [1, 2, 3];

const output3a = (input3 as Array<string | number>).concat(['foo']); // cast required :(

const output3b = P.pipe(
  input3, // no cast required :)
  P.Array_.concatW(['foo']),
);

const output3c = P.pipe(
  // @ts-expect-error   error if we want :)
  input3,
  P.Array_.concat(['foo']),
);
```

### Concatenating Non-Empty Arrays of Same Type

```typescript
const input2 = ['foo'];

const [output2a] = input2.concat(['bar']);
// @ts-expect-error   // can be undefined :(
const test2a: string = output2a;

const [output2b] = P.pipe(input2, P.NonEmptyArray_.concat(['bar']));
const test2b: string = output2b; // always defined :)
```

### Get String Prefix Before Certain Character

```typescript
const input4 = 'hello-world';

const [output4a] = input4.split('-');
// @ts-expect-error can be undefined :(
const test4a: string = output4a;

const [output4b] = P.pipe(input4, P.string_.split('-'));
const test4b: string = output4b; //  always defined :)

const [output4c] = P.string_.split('-')(input4); // without pipe
const test4c: string = output4c;
```

### Conditional Assigment of a Constant

This uses our custom
[IIFE](https://en.wikipedia.org/wiki/Immediately_invoked_function_expression)
helper.

```typescript
const raining = true;

// forced to use ternary :(
const output5a = raining ? 'rubber boots' : 'regular shoes';

// regular if statement works :)
const output5c = P.ii(() => {
  if (raining) {
    return 'rubber boots';
  }
  return 'regular shoes';
});
```

## Types

Previous chapter showcased some of the utilities included in our prelude.
This chapter contains a more exhaustive list of types of values that
the included utilities work on.

### function

- [function](https://gcanti.github.io/fp-ts/modules/function.ts.html)

```typescript
const zero = P.identity(0);
const one = P.function_.increment(zero);
const two = P.flow(P.function_.increment, P.function_.increment)(zero);
const three = [1, 2, 3, 4, 5, 6].find(P.Predicate_.not((x) => x < 3));
const four = P.pipe(
  zero,
  P.function_.increment,
  P.function_.increment,
  P.function_.increment,
  P.function_.increment,
);

function yesOrNo(input: boolean): 'yes' | 'no' {
  if (input === true) {
    return 'yes';
  }
  if (input === false) {
    return 'no';
  }
  return P.absurd(input);
}
```

### boolean

- [boolean](https://gcanti.github.io/fp-ts/modules/boolean.ts.html)

```typescript
const bool: boolean = true;
const boolConstant: true = true;
```

### string

- [string](https://gcanti.github.io/fp-ts/modules/number.ts.html)

```typescript
const string: string = 'foo';
const strConstant: 'foo' = 'foo';
```

### number

- [number](https://gcanti.github.io/fp-ts/modules/number.ts.html)

```typescript
const number: number = 123;
const numConstant: 123 = 123;
```

### Array

- [Array](https://gcanti.github.io/fp-ts/modules/Array.ts.html)
- [NonEmptyArray](https://gcanti.github.io/fp-ts/modules/NonEmptyArray.ts.html) array with at least one item

```typescript
const array: Array<string | number> = ['foo', 123, 'bar', 456];
```

### Tuple

- [Tuple](https://gcanti.github.io/fp-ts/modules/Tuple.ts.html)
- [Apply\_.sequenceT](https://gcanti.github.io/fp-ts/modules/Apply.ts.html#sequencet)

```typescript
const pair: [string, number] = ['foo', 123];
```

### Record

- [Record](https://gcanti.github.io/fp-ts/modules/Record.ts.html) key/value mapping

```typescript
const record: Record<string, string | number> = {
  foo: 'foo',
  bar: 123,
};
```

### Struct

- [Apply\_.sequenceS](https://gcanti.github.io/fp-ts/modules/Apply.ts.html#sequences)

```typescript
const struct: { foo: string; bar: number } = {
  foo: 'foo',
  bar: 123,
};
```

### Option

- [Option](https://gcanti.github.io/fp-ts/modules/Option.ts.html) value or "null"

```typescript
const anOptionalValue: P.Option<number> = {
  _tag: 'Some',
  value: 123,
};
// or
const anOptionalValue2: P.Option<number> = P.Option_.some(123);

const noOptionalValue: P.Option<number> = {
  _tag: 'None',
};
// or
const noOptionalValue2: P.Option<number> = P.Option_.none;
```

### Either

- [Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html) value or error

```typescript
// type aliases are useful for humans and maintainability
type Failure = string;

const eitherSucess: P.Either<Failure, number> = {
  _tag: 'Right',
  right: 123,
};
// or
const eitherSucess2: P.Either<Failure, number> = P.Either_.right(123);

const eitherFailure: P.Either<Failure, number> = {
  _tag: 'Left',
  left: 'Unable to calculate number',
};
// or
const failure2: P.Either<Failure, number> = P.Either_.left('Unable to calculate number');

type Divide = (d: number) => (i: number) => P.Either<Failure, number>;
const divide: Divide = (divider) => {
  return (input) => {
    if (divider === 0) {
      return {
        _tag: 'Left',
        left: 'Division by zero error',
      };
    }
    return {
      _tag: 'Right',
      right: input / divider,
    };
  };
};
// or
const divide2: Divide = (divider) => (input) =>
  P.pipe(
    P.Either_.right(divider),
    P.Either_.filterOrElse(
      (d) => d !== 0,
      () => 'Division by zero error',
    ),
    P.Either_.map((d) => input / d),
  );
```

### These

- [These](https://gcanti.github.io/fp-ts/modules/These.ts.html) extends either with `both` that can be used for warnings.

### Lazy

Lazy is used for wrapping pure but heavy computations in a "thunk" `() => factorize(someBigNumber)`.
It lets the caller discard the result without evaluating the computationaly heavy part.

- [Lazy](https://gcanti.github.io/fp-ts/modules/function.ts.html#lazy-interface)

### IO

IO wraps synchronous effects in a "thunk" `() => { ... your code goes here }`.
It lets the caller discard the result without executing the computation.
Unlike with Lazy functions, the computations are free to have side effects.
For example printing on the screen or returning a random number.

- [IO](https://gcanti.github.io/fp-ts/modules/IO.ts.html)
- [IOEither](https://gcanti.github.io/fp-ts/modules/IOEither.ts.html)

```typescript
const printHello: P.IO<void> = () => console.log('hello');
// or
const printHello2: P.IO<void> = P.Console_.log('hello');

type Printer = (x: unknown) => P.IO<void>;
const printer: Printer = (x) => () => console.log(x);
// or
const printer2: Printer = P.Console_.log;

type SumPrinter = (y: number) => (x: number) => P.IO<void>;
const printSum: SumPrinter = (y) => (x) => () => console.log(x + y);
// or
const printSum2: SumPrinter = (y) => (x) => P.Console_.log(x + y);

type Dice = (sides: number) => P.IO<number>;
const dice: Dice = (sides) => () => 1 + Math.floor(Math.random() * sides);
// or
const dice2: Dice = (sides) => P.Random_.randomInt(1, sides);

type D6 = P.IO<number>;
const d6: D6 = dice(6);

// P.IOEither<A, B> is the same as P.IO<P.Either<A, B>>
type D6Divider = (i: number) => P.IOEither<Failure, number>;
const d6Divider: D6Divider = (input) => () => {
  const diceRoll = d6();
  const logger = printer(diceRoll);
  logger();
  const diveByDiceRoll = divide(diceRoll);
  return diveByDiceRoll(input);
};
// or
const d6Divider2: D6Divider = (input) =>
  P.pipe(
    d6,
    P.IO_.chainFirst(P.Console_.log),
    P.IO_.map((diceRoll) => P.pipe(input, divide(diceRoll))),
  );
```

### Task

Task wraps asynchronous effects in a "thunk" `async () => { ... your code goes here }`.
It is a way of letting the caller discard the result without executing the computation.
Task is essentially same as IO but uses promises to wrap asynchronous return values.

- [Task](https://gcanti.github.io/fp-ts/modules/Task.ts.html)
- [TaskOption](https://gcanti.github.io/fp-ts/modules/TaskOption.ts.html)
- [TaskEither](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html)
- [TaskThese](https://gcanti.github.io/fp-ts/modules/TaskThese.ts.html)

```typescript
// Task and TaskEither is similar to IO and IOEither but work with Promises
type AsyncPrinter = <S>(s: S) => P.Task<void>;
const asyncPrinter: AsyncPrinter = (x) => async () => console.log(x);
// or
const asyncPrinter2: AsyncPrinter = P.Task_.fromIOK(P.Console_.log);
```

### Reader

Reader is used for injecting dependencies before executing the computation

- [Reader](https://gcanti.github.io/fp-ts/modules/Reader.ts.html)
- [ReaderEither](https://gcanti.github.io/fp-ts/modules/ReaderEither.ts.html)
- [ReaderTask](https://gcanti.github.io/fp-ts/modules/ReaderTask.ts.html)
- [ReaderTaskEither](https://gcanti.github.io/fp-ts/modules/ReaderTaskEither.ts.html)

```typescript
// ReaderTaskEither takes dependencies and returns a task with result
type WithoutDeps = (
  i: number,
) => P.ReaderTaskEither<{ print: AsyncPrinter }, Failure, number>;
const withoutDeps: WithoutDeps =
  (input) =>
  ({ print }) =>
  async () => {
    const diceRoll = d6();
    const logger = print(diceRoll);
    await logger();
    const diveByDiceRoll = divide(diceRoll);
    return diveByDiceRoll(input);
  };
// or
const withoutDeps2: WithoutDeps =
  (input) =>
  ({ print }) =>
    P.pipe(
      P.Task_.fromIO(d6),
      P.Task_.chainFirst(print),
      P.Task_.map((diceRoll) => P.pipe(input, divide(diceRoll))),
    );
```

## Functional Programming

The example code in the _Decoding JSON_ chapter above contained some
side-effects and introduced a `null` into the type signature. These are
properties that we would typically want to avoid in the functional parts
of our code. In the example below, we extend this example into a tiny
functional application that reads user information from a hypothetical
API and prints out the user information.

```typescript
import { Errors as ValidationErrors } from 'io-ts-validator';

type Api = {
  userInfo: (userId: number) => Promise<string>;
};
const api: Api = {
  userInfo: (userId) => {
    return Promise.resolve(JSON.stringify({ userId: userId, name: 'Bob' }));
  },
};

const logResult = (result: unknown) => () => console.log(result);

const main = pipe(
  P.TaskEither_.tryCatch(
    () => api.userInfo(123),
    (error) => ({ error: 'API Error', info: [String(error)] }),
  ),
  P.TaskEither_.chain((response) =>
    P.TaskEither_.fromEither(
      P.Either_.tryCatch(
        () => JSON.parse(response),
        (error) => ({ error: 'Parse Error', info: [String(error)] }),
      ),
    ),
  ),
  P.TaskEither_.chain((json) =>
    pipe(
      validator(User).decodeEither(json),
      P.Either_.mapLeft((errors) => ({ error: 'Decode Error', info: errors })),
      P.TaskEither_.fromEither,
    ),
  ),
  P.TaskEither_.fold(
    (error) => P.Task_.fromIO(logResult(error)),
    (user) => P.Task_.fromIO(logResult(user)),
  ),
);

main();
```

## Debugging Functional Code

The code example in previous chapter doesn't have many type signatures. This is not a problem since TypeScript is often able to infer the types for your code as long as you are using typesafe building blocks. Indeed, that is one of the reasons what makes functional programming a good match for strongly typed code.

Even thought explicit variable names and type signatures are not necessary for the compiler. It is often a good idea to provide some to make the code more readable. When you are building your first application it is a good idea to write type signatures for every tiny piece of the puzzle. This will help you pinpoint down possible errors in your code. Below is the code example from previous chapter with _way too many_ type signatures. However, this is exactly what you might want to confirm that the type inferance matches your expectation. You may then remove unnecessary clutter as you get more confident about your work.

```typescript
type BuildMain = P.ReaderTask<{ api: Api }, void>;
const buildMain: BuildMain = ({ api }) => {
  // IO Type Definitions

  type UserC = t.Type<{
    userId: number;
    name: string;
  }>;
  const User: UserC = t.type({
    userId: t.number,
    name: t.string,
  });
  type User = t.TypeOf<typeof User>;

  // Typesafe Output Mechanism

  const logResult = (result: unknown): P.IO<void> => {
    const action: P.IO<void> = () => {
      // effects are OK inside IO
      console.log(result);
    };
    return action;
  };

  // Internal Type Definitions

  type Response = string;
  type Json = unknown;

  enum Errors {
    Api = 'API Error',
    Parse = 'Parse Error',
    Decode = 'Decode Error',
  }

  interface ErrorInfo {
    error: Errors;
    info: Array<string>;
  }
  const ErrorInfo_ = {
    fromApiError: (error: unknown): ErrorInfo => ({
      error: Errors.Api,
      info: [String(error)],
    }),
    fromParseError: (error: unknown): ErrorInfo => ({
      error: Errors.Parse,
      info: [String(error)],
    }),
    fromDecodeError: (errors: ValidationErrors): ErrorInfo => ({
      error: Errors.Decode,
      info: errors,
    }),
  };

  // Architecture Description

  type ResponseRetriever = P.TaskEither<ErrorInfo, Response>;
  type ResponseParser = (
    s: P.TaskEither<ErrorInfo, Response>,
  ) => P.TaskEither<ErrorInfo, Json>;
  type UserDecoder = (j: P.TaskEither<ErrorInfo, Json>) => P.TaskEither<ErrorInfo, User>;
  type ResultReporter = (j: P.TaskEither<ErrorInfo, User>) => P.Task<void>;

  // Functional Implementation

  const responseRetriever: ResponseRetriever = P.TaskEither_.tryCatch(
    (): Promise<Response> => {
      // failure and effects are OK inside TaskEither
      return api.userInfo(123);
    },
    ErrorInfo_.fromApiError,
  );

  const responseParser: ResponseParser = P.TaskEither_.chain(
    (response: Response): P.TaskEither<ErrorInfo, Json> => {
      const parsingResult: P.Either<ErrorInfo, Json> = P.Either_.tryCatch((): Json => {
        // failure is OK inside an Either (but effects are NOT)
        return JSON.parse(response);
      }, ErrorInfo_.fromParseError);
      // We "lift" the result to TaskEither to match the type of the chain
      return P.TaskEither_.fromEither(parsingResult);
    },
  );

  const responseDecoder: UserDecoder = P.TaskEither_.chain(
    (json: Json): P.TaskEither<ErrorInfo, User> => {
      type ErrorTransform = (
        r: P.Either<ValidationErrors, User>,
      ) => P.Either<ErrorInfo, User>;
      const errorTransform: ErrorTransform = P.Either_.mapLeft(
        ErrorInfo_.fromDecodeError,
      );
      const rawDecodeResult: P.Either<ValidationErrors, User> =
        validator(User).decodeEither(json);

      const decodeResult: P.Either<ErrorInfo, User> = errorTransform(rawDecodeResult);
      return P.TaskEither_.fromEither(decodeResult);
    },
  );

  const resultReporter: ResultReporter = P.TaskEither_.fold(
    (error: ErrorInfo): P.Task<void> => {
      const action: P.IO<void> = logResult(error);
      return P.Task_.fromIO(action);
    },
    (user: User): P.Task<void> => {
      const action: P.IO<void> = logResult(user);
      return P.Task_.fromIO(action);
    },
  );

  return resultReporter(responseDecoder(responseParser(responseRetriever)));
};

const strictMain: P.Task<void> = buildMain({
  api: {
    userInfo: (userId: number): Promise<string> => {
      return Promise.resolve(JSON.stringify({ userId: userId, name: 'Bob' }));
    },
  },
});

// Our entire application is typesafe up to this point.  The execution of the
// main Task<void> (below) breaks referential transparency and returns
// Promise<void>.  We chose type Task<void> for main to indicate that we were
// building a standalone application.  If we were building a functional plugin
// we might have chosen main to have type Task<User|null> to let the parent
// application access the result of the computation.

strictMain();
```
