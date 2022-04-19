# MaaS Global Typescript Package Template

This template is intended as a strating point for new npm packages.

You can import the example library as follows.

```typescript
import * as lib from 'maasglobal-template-ts';
lib.fpSendSms; // functional implementation
lib.ooSendSms; // shim for non-functional code
```

You can execute the FP version as follows

```typescript
import * as P from 'maasglobal-prelude-ts';
import * as ruins from 'ruins-ts';
import { fpSendSms } from 'maasglobal-template-ts';
const main = P.pipe('Hello world!', fpSendSms('+3581234567'));
ruins.fromTaskEither(main);
```

You can use the OO shim for object oriented projects

```typescript
import { ooSendSms } from 'maasglobal-template-ts';
ooSendSms('+3581234567', 'Hello world!');
```

Code examples annotated with `typescript` will be extracted and tested.

```typescript
function sum(a: number, b: number): number {
  return a + b;
}
```

Code examples annotated with `ts` are ignored by tests and may be incomplete

```ts
function product(a: number, b: number): number {
  ... your code goes here ...
}
```

## Devops

```
npm install -g yarn               # install yarn
yarn                              # install dependencies
yarn lint                         # run linters
yarn typecheck                    # run static type checks
yarn test                         # run tests
yarn prettify                     # auto format code base
yarn ci                           # perform a local CI test run
yarn build                        # create a production build
yarn clean                        # remove build artefacts
yarn readme-ts                    # extract readme code examples
yarn deploy-npm                   # deploy npm package
yarn deploy-alpha                 # deploy prelease npm package
```
