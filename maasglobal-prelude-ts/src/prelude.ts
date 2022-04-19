// TypeScript Prelude

import { flow } from 'fp-ts/lib/function';
import * as t from 'io-ts';

// Control Flow

export { pipe, flow, identity, absurd } from 'fp-ts/lib/function';

// IIFE

export type FE<R> = () => R;
export type II = <R>(fe: FE<R>) => R;
export const ii: II = (fe) => fe();

// Branding
export type Brand<B> = t.Brand<B>;
export type Branded<T, B> = t.Branded<T, B>;
export type Unbranded<T> = Omit<T, keyof Brand<unknown>>;

// Nullable
export type Nullable<T> = T | null;

// NonNullable
type NonNullableExport<T> = NonNullable<T>;
export { NonNullableExport as NonNullable };

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
export * as string_ from 'fp-ts/lib/string';

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
export { Predicate } from 'fp-ts/lib/Predicate';
export * as Predicate_ from 'fp-ts/lib/Predicate';

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
export * as number_ from 'fp-ts/lib/number';
export { NumberFromString as numberFromString } from 'io-ts-types/lib/NumberFromString';

// Array
const ArrayExport = t.array;
type ArrayExport<T> = Array<T>;
export { ArrayExport as Array };
export * as Array_ from 'fp-ts/lib/Array';
export const array = <A>(...a: Array<A>): Array<A> => a;

// ReadonlyArray
const ReadonlyArrayExport = t.readonlyArray;
type ReadonlyArrayExport<T> = ReadonlyArray<T>;
export { ReadonlyArrayExport as ReadonlyArray };
export * as ReadonlyArray_ from 'fp-ts/lib/ReadonlyArray';
export const readonlyArray = <A>(...a: ReadonlyArray<A>): ReadonlyArray<A> => a;

// Set
type SetExport<T> = Set<T>;
export { SetExport as Set };
export * as Set_ from 'fp-ts/lib/Set';
export const set = <A>(...a: Array<A>): Set<A> => new Set(a);
export { setFromArray as SetFromArray } from 'io-ts-types/lib/setFromArray';

// ReadonlySet
type ReadonlySetExport<T> = ReadonlySet<T>;
export { ReadonlySetExport as ReadonlySet };
export * as ReadonlySet_ from 'fp-ts/lib/ReadonlySet';
export const readonlySet = <A>(...a: Array<A>): ReadonlySet<A> => new Set(a);
export { readonlySetFromArray as ReadonlySetFromArray } from 'io-ts-types/lib/readonlySetFromArray';

// Tuple
const TupleCodec = t.tuple;
type TupleType<T extends Array<any>> = T;
export const Tuple = TupleCodec;
export type Tuple<T extends Array<any>> = TupleType<T>;
export * as Tuple_ from 'fp-ts/lib/Tuple';
export const tuple = <T extends Array<any>>(...t: Tuple<T>): Tuple<T> => t;

// ReadonlyTuple
const ReadonlyTupleCodec = flow(t.tuple, t.readonly);
type ReadonlyTupleType<T extends Array<any>> = T;
export const ReadonlyTuple = ReadonlyTupleCodec;
export type ReadonlyTuple<T extends Array<any>> = ReadonlyTupleType<T>;
export * as ReadonlyTuple_ from 'fp-ts/lib/ReadonlyTuple';
export const readonlyTuple = <T extends Array<any>>(
  ...t: ReadonlyTuple<T>
): ReadonlyTuple<T> => t;

// Record
const RecordExport = t.record;
type RecordExport<K extends string | number | symbol, T> = Record<K, T>;
export { RecordExport as Record };
export * as Record_ from 'fp-ts/lib/Record';

// ReadonlyRecord
import { ReadonlyRecord as ReadonlyRecordType } from 'fp-ts/lib/ReadonlyRecord';
const ReadonlyRecordExport = flow(t.record, t.readonly);
type ReadonlyRecordExport<K extends string, T> = ReadonlyRecordType<K, T>;
export { ReadonlyRecordExport as ReadonlyRecord };
export * as ReadonlyRecord_ from 'fp-ts/lib/ReadonlyRecord';

// struct
export const struct = t.type;
export * as struct_ from 'fp-ts/lib/struct';

// Int
export { Int } from 'io-ts';
export { IntFromString } from 'io-ts-types/lib/IntFromString';

// NonEmptyArray
import { NonEmptyArray as NonEmptyArrayType } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray as NonEmptyArrayCodec } from 'io-ts-types/lib/nonEmptyArray';
export const NonEmptyArray = NonEmptyArrayCodec;
export type NonEmptyArray<A> = NonEmptyArrayType<A>;
export * as NonEmptyArray_ from 'fp-ts/lib/NonEmptyArray';

// ReadonlyNonEmptyArray
import { ReadonlyNonEmptyArray as ReadonlyNonEmptyArrayType } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { readonlyNonEmptyArray as ReadonlyNonEmptyArrayCodec } from 'io-ts-types/lib/readonlyNonEmptyArray';
export const ReadonlyNonEmptyArray = ReadonlyNonEmptyArrayCodec;
export type ReadonlyNonEmptyArray<A> = ReadonlyNonEmptyArrayType<A>;
export * as ReadonlyNonEmptyArray_ from 'fp-ts/lib/ReadonlyNonEmptyArray';

// Identity
export { Identity } from 'fp-ts/lib/Identity';
export * as Identity_ from 'fp-ts/lib/Identity';

// Option
import { Option as OptionType } from 'fp-ts/lib/Option';
import { option as OptionCodec } from 'io-ts-types/lib/option';
export const Option = OptionCodec;
export type Option<A> = OptionType<A>;
export { optionFromNullable as OptionFromNullable } from 'io-ts-types/lib/optionFromNullable';
export * as Option_ from 'fp-ts/lib/Option';

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

// Left
export { Left } from 'fp-ts/lib/Either';
export { left } from 'fp-ts/lib/Either';

// Right
export { Right } from 'fp-ts/lib/Either';
export { right } from 'fp-ts/lib/Either';

// These
import { These as TheseType } from 'fp-ts/lib/These';
export type These<E, A> = TheseType<E, A>;
export * as These_ from 'fp-ts/lib/These';

// Both
export { Both } from 'fp-ts/lib/These';
export { both } from 'fp-ts/lib/These';

// IO
export { IO } from 'fp-ts/lib/IO';
export * as IO_ from 'fp-ts/lib/IO';

// IOEither
export { IOEither } from 'fp-ts/lib/IOEither';
export * as IOEither_ from 'fp-ts/lib/IOEither';

// Task
export { Task } from 'fp-ts/lib/Task';
export * as Task_ from 'fp-ts/lib/Task';

// TaskOption
export { TaskOption } from 'fp-ts/lib/TaskOption';
export * as TaskOption_ from 'fp-ts/lib/TaskOption';

// TaskEither
export { TaskEither } from 'fp-ts/lib/TaskEither';
export * as TaskEither_ from 'fp-ts/lib/TaskEither';

// TaskThese
export { TaskThese } from 'fp-ts/lib/TaskThese';
export * as TaskThese_ from 'fp-ts/lib/TaskThese';

// Reader
export { Reader } from 'fp-ts/lib/Reader';
export * as Reader_ from 'fp-ts/lib/Reader';

// ReaderEither
export { ReaderEither } from 'fp-ts/lib/ReaderEither';
export * as ReaderEither_ from 'fp-ts/lib/ReaderEither';

// ReaderTask
export { ReaderTask } from 'fp-ts/lib/ReaderTask';
export * as ReaderTask_ from 'fp-ts/lib/ReaderTask';

// ReaderTaskEither
export { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
export * as ReaderTaskEither_ from 'fp-ts/lib/ReaderTaskEither';

// Magma
export { Magma } from 'fp-ts/lib/Magma';
export * as Magma_ from 'fp-ts/lib/Magma';

// Refinement
export { Refinement } from 'fp-ts/lib/Refinement';
export * as Refinement_ from 'fp-ts/lib/Refinement';

// Ord
export { Ord } from 'fp-ts/lib/Ord';
export * as Ord_ from 'fp-ts/lib/Ord';

// Eq
export { Eq } from 'fp-ts/lib/Eq';
export * as Eq_ from 'fp-ts/lib/Eq';

// Apply
export * as Apply_ from 'fp-ts/lib/Apply';

// Foldable
export * as Foldable_ from 'fp-ts/lib/Foldable';

// Json
export { Json } from 'fp-ts/lib/Json';
export * as Json_ from 'fp-ts/lib/Json';

// Console
export * as Console_ from 'fp-ts/lib/Console';

// Random
export * as Random_ from 'fp-ts/lib/Random';
