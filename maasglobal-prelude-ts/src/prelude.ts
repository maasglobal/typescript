// TypeScript Prelude

import * as t from 'io-ts';

// Control Flow

export { pipe } from 'fp-ts/lib/pipeable';
export { flow } from 'fp-ts/lib/function';
export { identity } from 'fp-ts/lib/function';

// IIFE

export type FE<R> = () => R;
export type II = <R>(fe: FE<R>) => R;
export const ii: II = (fe) => fe();

// unknown
const unknownExport = t.unknown;
type unknownExport = unknown;
export { unknownExport as unknown };

// null
const nullExport = t.null;
type nullExport = null;
export { nullExport as null };

// string
const stringExport = t.string;
type stringExport = string;
export { stringExport as string };

// undefined
const undefinedExport = t.undefined;
type undefinedExport = undefined;
export { undefinedExport as undefined };

// void
const voidExport = t.void;
type voidExport = void;
export { voidExport as void };
export const void_ = {
  fromArray: (_va: Array<void>): void => undefined,
};

// function
import * as function_ from 'fp-ts/lib/function';
export { function_ };

// Lazy
export { Lazy } from 'fp-ts/lib/function';

// Predicate
export { Predicate } from 'fp-ts/lib/function';

// boolean
const booleanExport = t.boolean;
type booleanExport = boolean;
export { booleanExport as boolean };
import * as boolean_ from 'fp-ts/lib/boolean';
export { boolean_ };

// number
const numberExport = t.number;
type numberExport = number;
export { numberExport as number };
export { NumberFromString as numberFromString } from 'io-ts-types/lib/NumberFromString';

// Array
const ArrayExport = t.array;
type ArrayExport<T> = Array<T>;
export { ArrayExport as Array };
import * as Array_ from 'fp-ts/lib/Array';
export { Array_ };
export { array as Array__ } from 'fp-ts/lib/Array';
export const array = <A>(...a: Array<A>) => a;

// Record
const RecordExport = t.record;
type RecordExport<K extends string | number | symbol, T> = Record<K, T>;
export { RecordExport as Record };
import * as Record_ from 'fp-ts/lib/Record';
export { Record_ };
export { record as Record__ } from 'fp-ts/lib/Record';

// Int
export { Int } from 'io-ts';
export { IntFromString } from 'io-ts-types/lib/IntFromString';

// NonEmptyArray
import { nonEmptyArray as NonEmptyArrayCodec } from 'io-ts-types/lib/nonEmptyArray';
import { NonEmptyArray as NonEmptyArrayType } from 'fp-ts/lib/NonEmptyArray';
export const NonEmptyArray = NonEmptyArrayCodec;
export type NonEmptyArray<A> = NonEmptyArrayType<A>;
import * as NonEmptyArray_ from 'fp-ts/lib/NonEmptyArray';
export { NonEmptyArray_ };
export { nonEmptyArray as NonEmptyArray__ } from 'fp-ts/lib/NonEmptyArray';

// Option
import { Option as OptionType } from 'fp-ts/lib/Option';
import { option as OptionCodec } from 'io-ts-types/lib/option';
export const Option = OptionCodec;
export type Option<A> = OptionType<A>;
export { optionFromNullable as OptionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as Option_ from 'fp-ts/lib/Option';
export { Option_ };
export { option as Option__ } from 'fp-ts/lib/Option';

// None
export { None } from 'fp-ts/lib/Option';
export { none } from 'fp-ts/lib/Option';

// Some
export { Some } from 'fp-ts/lib/Option';
export { some } from 'fp-ts/lib/Option';

// Either
import { Either as EitherType } from 'fp-ts/lib/Either';
import { either as EitherCodec } from 'io-ts-types/lib/either';
export const Either = EitherCodec;
export type Either<E, A> = EitherType<E, A>;
import * as Either_ from 'fp-ts/lib/Either';
export { Either_ };
export { either as Either__ } from 'fp-ts/lib/Either';

// Left
export { Left } from 'fp-ts/lib/Either';
export { left } from 'fp-ts/lib/Either';

// Right
export { Right } from 'fp-ts/lib/Either';
export { right } from 'fp-ts/lib/Either';

// IO
export { IO } from 'fp-ts/lib/IO';
import * as IO_ from 'fp-ts/lib/IO';
export { IO_ };
export { io as IO__ } from 'fp-ts/lib/IO';

// IOEither
export { IOEither } from 'fp-ts/lib/IOEither';
import * as IOEither_ from 'fp-ts/lib/IOEither';
export { IOEither_ };
export { ioEither as IOEither__ } from 'fp-ts/lib/IOEither';

// Task
export { Task } from 'fp-ts/lib/Task';
import * as Task_ from 'fp-ts/lib/Task';
export { Task_ };
export { task as Task__ } from 'fp-ts/lib/Task';
export { taskSeq as TaskSeq__ } from 'fp-ts/lib/Task';

// TaskEither
export { TaskEither } from 'fp-ts/lib/TaskEither';
import * as TaskEither_ from 'fp-ts/lib/TaskEither';
export { TaskEither_ };
export { taskEither as TaskEither__ } from 'fp-ts/lib/TaskEither';
export { taskEitherSeq as TaskEitherSeq__ } from 'fp-ts/lib/TaskEither';

// Magma
export { Magma } from 'fp-ts/lib/Magma';

// Ord
export { Ord } from 'fp-ts/lib/Ord';
import * as Ord_ from 'fp-ts/lib/Ord';
export { Ord_ };
export { ord as Ord__ } from 'fp-ts/lib/Ord';

// Reader
import * as Reader_ from 'fp-ts/lib/Reader';
export { Reader_ };

// Apply
import * as Apply_ from 'fp-ts/lib/Apply';
export { Apply_ };

// Foldable
import * as Foldable_ from 'fp-ts/lib/Foldable';
export { Foldable_ };
