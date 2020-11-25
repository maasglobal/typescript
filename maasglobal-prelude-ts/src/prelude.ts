// TypeScript Prelude

import * as t from 'io-ts';

// Control Flow

export { Do as do } from 'fp-ts-contrib/lib/Do';
export { pipe, flow, identity } from 'fp-ts/lib/function';

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
export * as function_ from 'fp-ts/lib/function';

// Lazy
export { Lazy } from 'fp-ts/lib/function';

// Predicate
export { Predicate } from 'fp-ts/lib/function';

// boolean
const booleanExport = t.boolean;
type booleanExport = boolean;
export { booleanExport as boolean };
export * as boolean_ from 'fp-ts/lib/boolean';
export { BooleanFromString as booleanFromString } from 'io-ts-types/lib/BooleanFromString';

// number
const numberExport = t.number;
type numberExport = number;
export { numberExport as number };
export { NumberFromString as numberFromString } from 'io-ts-types/lib/NumberFromString';

// Array
const ArrayExport = t.array;
type ArrayExport<T> = Array<T>;
export { ArrayExport as Array };
export * as Array_ from 'fp-ts/lib/Array';
export { array as Array__ } from 'fp-ts/lib/Array';
export const array = <A>(...a: Array<A>): Array<A> => a;

// Tuple
const TupleCodec = t.tuple;
type TupleType<T extends Array<any>> = T;
export const Tuple = TupleCodec;
export type Tuple<T extends Array<any>> = TupleType<T>;
export * as Tuple_ from 'fp-ts/lib/Tuple';
export { tuple as Tuple__ } from 'fp-ts/lib/Tuple';
export const tuple = <T extends Array<any>>(...t: Tuple<T>): Tuple<T> => t;

// Record
const RecordExport = t.record;
type RecordExport<K extends string | number | symbol, T> = Record<K, T>;
export { RecordExport as Record };
export * as Record_ from 'fp-ts/lib/Record';
export { record as Record__ } from 'fp-ts/lib/Record';

// Int
export { Int } from 'io-ts';
export { IntFromString } from 'io-ts-types/lib/IntFromString';

// NonEmptyArray
import { NonEmptyArray as NonEmptyArrayType } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray as NonEmptyArrayCodec } from 'io-ts-types/lib/nonEmptyArray';
export const NonEmptyArray = NonEmptyArrayCodec;
export type NonEmptyArray<A> = NonEmptyArrayType<A>;
export * as NonEmptyArray_ from 'fp-ts/lib/NonEmptyArray';
export { nonEmptyArray as NonEmptyArray__ } from 'fp-ts/lib/NonEmptyArray';

// Identity
export { Identity } from 'fp-ts/lib/Identity';
export * as Identity_ from 'fp-ts/lib/Identity';
export { identity as Identity__ } from 'fp-ts/lib/Identity';

// Option
import { Option as OptionType } from 'fp-ts/lib/Option';
import { option as OptionCodec } from 'io-ts-types/lib/option';
export const Option = OptionCodec;
export type Option<A> = OptionType<A>;
export { optionFromNullable as OptionFromNullable } from 'io-ts-types/lib/optionFromNullable';
export * as Option_ from 'fp-ts/lib/Option';
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
export * as Either_ from 'fp-ts/lib/Either';
export { either as Either__ } from 'fp-ts/lib/Either';

// Left
export { Left } from 'fp-ts/lib/Either';
export { left } from 'fp-ts/lib/Either';

// Right
export { Right } from 'fp-ts/lib/Either';
export { right } from 'fp-ts/lib/Either';

// IO
export { IO } from 'fp-ts/lib/IO';
export * as IO_ from 'fp-ts/lib/IO';
export { io as IO__ } from 'fp-ts/lib/IO';

// IOEither
export { IOEither } from 'fp-ts/lib/IOEither';
export * as IOEither_ from 'fp-ts/lib/IOEither';
export { ioEither as IOEither__ } from 'fp-ts/lib/IOEither';

// Task
export { Task } from 'fp-ts/lib/Task';
export * as Task_ from 'fp-ts/lib/Task';
export { task as Task__ } from 'fp-ts/lib/Task';
export { taskSeq as TaskSeq__ } from 'fp-ts/lib/Task';

// TaskEither
export { TaskEither } from 'fp-ts/lib/TaskEither';
export * as TaskEither_ from 'fp-ts/lib/TaskEither';
export { taskEither as TaskEither__ } from 'fp-ts/lib/TaskEither';
export { taskEitherSeq as TaskEitherSeq__ } from 'fp-ts/lib/TaskEither';

// Reader
export { Reader } from 'fp-ts/lib/Reader';
export * as Reader_ from 'fp-ts/lib/Reader';
export { reader as Reader__ } from 'fp-ts/lib/Reader';

// ReaderEither
export { ReaderEither } from 'fp-ts/lib/ReaderEither';
export * as ReaderEither_ from 'fp-ts/lib/ReaderEither';
export { readerEither as ReaderEither__ } from 'fp-ts/lib/ReaderEither';

// ReaderTask
export { ReaderTask } from 'fp-ts/lib/ReaderTask';
export * as ReaderTask_ from 'fp-ts/lib/ReaderTask';
export { readerTask as ReaderTask__ } from 'fp-ts/lib/ReaderTask';

// ReaderTaskEither
export { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
export * as ReaderTaskEither_ from 'fp-ts/lib/ReaderTaskEither';
export { readerTaskEither as ReaderTaskEither__ } from 'fp-ts/lib/ReaderTaskEither';

// Magma
export { Magma } from 'fp-ts/lib/Magma';

// Ord
export { Ord } from 'fp-ts/lib/Ord';
export * as Ord_ from 'fp-ts/lib/Ord';
export { ord as Ord__ } from 'fp-ts/lib/Ord';

// Eq
export { Eq } from 'fp-ts/lib/Eq';
export * as Eq_ from 'fp-ts/lib/Eq';
export { eq as Eq__ } from 'fp-ts/lib/Eq';

// Apply
export * as Apply_ from 'fp-ts/lib/Apply';

// Foldable
export * as Foldable_ from 'fp-ts/lib/Foldable';
