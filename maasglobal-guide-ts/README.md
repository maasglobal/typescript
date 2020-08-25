# MaaS Global Guide to TypeScript and Functional Programming

TypeScript has a relatively good [type system](https://typescriptlang.org/docs/) that lets the developer validate architectural decisions by describing them in the integrated type language. However, taking [full advantage](https://softwareengineering.stackexchange.com/questions/347402/how-do-the-type-systems-in-functional-languages-differ-from-those-in-oo-language/347426) requires maintaining referential transparency. This means avoiding mutations and constructing new immutable values with functional programming tools.

This guide attemps to explaing basics of working with a code base written in this manner. The guide covers basics of [type variables](https://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables), [io-ts](https://github.com/gcanti/io-ts/blob/master/README.md#implemented-types--combinators) and [fp-ts](https://gcanti.github.io/fp-ts/introduction/core-concepts.html) data structures.

#### Type Variables

TypeScript throws away the types of your function inputs by default.
You can preserve the types by annotating your function with type variables.
```typescript
function createPair<A,B>(first: A, second: B): [A, B] {
  return [first, second];
}
```

Above we defined the types in the function definition but it is also ok
to define the types for the const that contains the function. As long
as TypeScript can infer the types you should be ok. Please note how `a`
and `b` are meaningless in the example below but are still required in
the code.

```typescript
type PairCreator = <A,B>(a: A, b: B) => [A, B];
const createPair: PairCreator = (first, second) => [first, second];
```

#### Pipeline

The code base makes heavy use of pipelines. Pipelines are the Javascript equivalent for UNIX pipes (the `ls|grep omg` sort of thing). The [pipeline operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator) `|>` is an upcoming starndard. TypeScript is currently [waiting](https://github.com/microsoft/TypeScript/issues/17718) for TC39 standardization. However, fp-ts provides a similar `pipe` function that works today. It works as follows.

```typescript
import { pipe } from 'fp-ts/lib/pipeable'

const double = (n) => n * 2;
const increment = (n) => n + 1;

pipe(
  5,
  double,
  double,
  increment,
  double,
); // 42
```

#### Decoding JSON

Another situation where the type information is lost is when we convert
our data structures to JSON. Or the data might not have types to begin
if we read it from some external source. We use io-ts for such types
since this provides us with the type signature but also a matching
runtime validator.

In the example below we define io-ts data type user with the static
type `type User = ` and runtime validator `const User = `. The static
type is equivalent to `{ userId: number, name: string }`.

```typescript
import * as t from 'io-ts'

const User = t.type({
  userId: t.number,
  name: t.string
})
type User = t.TypeOf<typeof User>
```

In the example below we pass a json structure to the runtime validator.
We then convert error information into human readable form with `PathReporter`,
prints an error message to the console as a side-effect of folding the
result into valid user or null.

```typescript
import { pipe } from 'fp-ts/lib/pipeable';
import * as Either_ from 'fp-ts/lib/Either';
import { failure } from 'io-ts/lib/PathReporter';

const json: unknown = JSON.parse('{"userId":123,"name":"Bob"}');

const maybeUser: User | null = pipe(
  User.decode(json),
  Either_.fold(
    (errors) => {
      console.error(failure(errors));
      return null;
    },
    (user) => user,
  ),
);
```

#### Functional Programming

The example code in the _Decoding JSON_ chapter above contained some
side-effects and introduced a `null` into the type signature. These are
properties that we would typically want to avoid in the functional parts
of our code. In the example below, we extend this example into a tiny
functional application that reads user information from a hypothetical
API and prints out the user information.

```typescript
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as Task_ from 'fp-ts/lib/Task';
import * as Either_ from 'fp-ts/lib/Either';
import * as TaskEither_ from 'fp-ts/lib/TaskEither';
import { failure } from 'io-ts/lib/PathReporter';

const api = {
  userInfo: (userId: number): Promise<string> => {
    return Promise.resolve(JSON.stringify({ userId: userId, name: 'Bob' }));
  },
};

const User = t.type({
  userId: t.number,
  name: t.string,
});
type User = t.TypeOf<typeof User>;

const logResult = (result: unknown) => () => console.log(result);

const main = pipe(
  TaskEither_.tryCatch(() => api.userInfo(123), (error) => ({ error: 'API Error', info: [String(error)] })),
  TaskEither_.chain((response) =>
    TaskEither_.fromEither(
      Either_.tryCatch(() => JSON.parse(response), (error) => ({ error: 'Parse Error', info: [String(error)] })),
    ),
  ),
  TaskEither_.chain((json) =>
    pipe(
      User.decode(json),
      Either_.mapLeft((errors) => ({ error: 'Decode Error', info: failure(errors) })),
      TaskEither_.fromEither,
    ),
  ),
  TaskEither_.fold((error) => Task_.fromIO(logResult(error)), (user) => Task_.fromIO(logResult(user))),
);

main();
```

#### Debugging Functional Code

The code example in previous chapter doesn't have many type signatures. This is not a problem since TypeScript is often able to infer the types for your code as long as you are using typesafe building blocks. Indeed, that is one of the reasons what makes functional programming a good match for strongly typed code.

Even thought explicit variable names and type signatures are not necessary for the compiler. It is often a good idea to provide some to make the code more readable. When you are building your first application it is a good idea to write type signatures for every tiny piece of the puzzle. This will help you pinpoint down possible errors in your code. Below is the code example from previous chapter with *way too many* type signatures. However, this is exactly what you might want to confirm that the type inferance matches your expectation. You may then remove unnecessary clutter as you get more confident about your work.

```typescript
import * as t from 'io-ts';
import * as Task_ from 'fp-ts/lib/Task';
import * as Either_ from 'fp-ts/lib/Either';
import * as TaskEither_ from 'fp-ts/lib/TaskEither';
import { failure } from 'io-ts/lib/PathReporter';

// Type Imports

import { IO } from 'fp-ts/lib/IO';
import { Task } from 'fp-ts/lib/Task';
import { Either } from 'fp-ts/lib/Either';
import { TaskEither } from 'fp-ts/lib/TaskEither';

// Loosely Typed Javascript API

const api = {
  userInfo: (userId: number): Promise<string> => {
    return Promise.resolve(JSON.stringify({ userId: userId, name: 'Bob' }));
  },
};

// Typesafe Output Mechanism

const logResult = (result: unknown): IO<void> => {
  const action: IO<void> = () => {
    // effects are OK inside IO
    console.log(result);
  };
  return action;
};

// IO Type Definitions

const User = t.type({
  userId: t.number,
  name: t.string,
});
type User = t.TypeOf<typeof User>;

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
  fromApiError: (error: unknown): ErrorInfo => ({ error: Errors.Api, info: [String(error)] }),
  fromParseError: (error: unknown): ErrorInfo => ({ error: Errors.Parse, info: [String(error)] }),
  fromDecodeError: (errors: t.Errors): ErrorInfo => ({ error: Errors.Decode, info: failure(errors) }),
};

// Architecture Description

type ResponseRetriever = TaskEither<ErrorInfo, Response>;
type ResponseParser = (s: TaskEither<ErrorInfo, Response>) => TaskEither<ErrorInfo, Json>;
type UserDecoder = (j: TaskEither<ErrorInfo, Json>) => TaskEither<ErrorInfo, User>;
type ResultReporter = (j: TaskEither<ErrorInfo, User>) => Task<void>;

// Functional Implementation

const responseRetriever: ResponseRetriever = TaskEither_.tryCatch((): Promise<Response> => {
  // failure and effects are OK inside TaskEither
  return api.userInfo(123);
}, ErrorInfo_.fromApiError);

const responseParser: ResponseParser = TaskEither_.chain(
  (response: Response): TaskEither<ErrorInfo, Json> => {
    const parsingResult: Either<ErrorInfo, Json> = Either_.tryCatch((): Json => {
      // failure is OK inside an Either (but effects are NOT)
      return JSON.parse(response);
    }, ErrorInfo_.fromParseError);
    // We "lift" the result to TaskEither to match the type of the chain
    return TaskEither_.fromEither(parsingResult);
  },
);

const responseDecoder: UserDecoder = TaskEither_.chain(
  (json: Json): TaskEither<ErrorInfo, User> => {
    type ErrorTransform = (r: Either<t.Errors, User>) => Either<ErrorInfo, User>;
    const errorTransform: ErrorTransform = Either_.mapLeft(ErrorInfo_.fromDecodeError);
    const rawDecodeResult: Either<t.Errors, User> = User.decode(json);
    const decodeResult: Either<ErrorInfo, User> = errorTransform(rawDecodeResult);
    return TaskEither_.fromEither(decodeResult);
  },
);

const resultReporter: ResultReporter = TaskEither_.fold(
  (error: ErrorInfo): Task<void> => {
    const action: IO<void> = logResult(error);
    return Task_.fromIO(action);
  },
  (user: User): Task<void> => {
    const action: IO<void> = logResult(user);
    return Task_.fromIO(action);
  },
);

const main: Task<void> = resultReporter(responseDecoder(responseParser(responseRetriever)));

// Our entire application is typesafe up to this point.  The execution of the
// main Task<void> (below) breaks referential transparency and returns
// Promise<void>.  We chose type Task<void> for main to indicate that we were
// building a standalone application.  If we were building a functional plugin
// we might have chosen main to have type Task<User|null> to let the parent
// application access the result of the computation.

main();
```

#### Links To Some Basic Tools

* [function](https://gcanti.github.io/fp-ts/modules/function.ts.html) helper functions
* [Record](https://gcanti.github.io/fp-ts/modules/Record.ts.html) key/value mapping
* [Array](https://gcanti.github.io/fp-ts/modules/Array.ts.html) regular arrays
* [NonEmptyArray](https://gcanti.github.io/fp-ts/modules/NonEmptyArray.ts.html) array with at least one item

* [Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html) value or error
* [Option](https://gcanti.github.io/fp-ts/modules/Option.ts.html) value or "null"

Taming [non-functional](https://gcanti.github.io/fp-ts/recipes/interoperability.html) code
* [IO](https://gcanti.github.io/fp-ts/modules/IO.ts.html)/[IOEither](https://gcanti.github.io/fp-ts/modules/IOEither.ts.html) safety wrapper for synchronous side-effects
* [Task](https://gcanti.github.io/fp-ts/modules/Task.ts.html)/[TaskEither](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html) safety wrapper for asynchronous side-effects
