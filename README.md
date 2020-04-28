# MaaS Global TypeScript Essentials

This repository contains most essential TypeScript utility packages used at MaaS Global.

## Frontend Packages

The code is divided into several independent packages.

* [eslint-config-maasglobal-ts](eslint-config-maasglobal-ts) contains shared eslint configuration
* [maasglobal-guide-ts](maasglobal-guide-ts) contains short programing guide
* [maasglobal-prelude-ts](maasglobal-prelude-ts) contains essential imports to be shared between projects

## Related Packages

* [fp-ts](https://gcanti.github.io/fp-ts/introduction/core-concepts.html)
* [io-ts](https://github.com/gcanti/io-ts/blob/master/README.md#implemented-types--combinators)

## Devops

The following commands should work in all packages where applicable.

```
npm install -g yarn               # install yarn
yarn                              # install dependencies
yarn lint                         # run linters
yarn typecheck                    # run static type checks
yarn test                         # run tests
yarn eslint --fix                 # auto format code base
yarn ci                           # perform a local CI test run
yarn build                        # create a production build
yarn deploy-npm                   # deploy npm package
```
