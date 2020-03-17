# MaaS Global Prelude for TypeScript Projects

The maasglobal-prelude-ts npm package is a bundle of essential imports for TypeScript projects.

## Some convenience tools

```typescript
import * as P from 'maasglobal-prelude-ts';

const x = 2;
const limit = 10;
const isOverLimit = P.ii(() => {
  if (x > limit) {
    return true;
  }
  return false;
});
```

## Some basic tools from fp-ts

```typescript
import * as P from 'maasglobal-prelude-ts';

const numbers = [1, 2, 3];
const doubled = P.pipe(
  numbers,
  P.Array_.map((x) => 2 * x),
);
```

## Some basic codecs from io-ts

```typescript
import * as P from 'maasglobal-prelude-ts';

const NumberArray = P.Array(P.number);
const onTheWire = JSON.stringify(NumberArray.encode([1, 2, 3]));
const atTheServer = NumberArray.decode(JSON.parse(onTheWire));
```
