import type { Either as StandardEither } from "./Either";
import type { Either as TupleEither } from "./tuple";
import type { Either as GoEither } from "./go";

export type EitherMode = "standard" | "tuple" | "go" | "any";

export type AnyEither<T> = StandardEither<T> | TupleEither<T> | GoEither<T>;

export type MightFailFunction<TEitherMode extends EitherMode> = <T>(
  promise: Promise<T>
) => Promise<
  TEitherMode extends "standard"
    ? StandardEither<T>
    : TEitherMode extends "tuple"
    ? TupleEither<T>
    : TEitherMode extends "go"
    ? GoEither<T>
    : AnyEither<T>
>;

export type PromiseFulfilledResult<T> = {
  status: "fulfilled";
  value: T;
};
export type PromiseRejectedResult = {
  status: "rejected";
  reason: any;
};
export type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

export type MightFail<
  TEitherMode extends EitherMode,
  TPromiseStaticMethods = PromiseStaticMethods<TEitherMode>
> = MightFailFunction<TEitherMode> & TPromiseStaticMethods;

export interface PromiseStaticMethods<TEitherMode extends EitherMode> {
  /**
   * Wraps a Promise.all call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<T[]>>}
   */
  all<T>(values: Iterable<T | PromiseLike<T>>): Promise<
      TEitherMode extends "standard"
          ?Awaited<StandardEither<T>[]>
          : TEitherMode extends "tuple"
              ? Awaited<TupleEither<T>[]>
              : TEitherMode extends "go"
                  ? Awaited<GoEither<T>[]>
                  : Awaited<AnyEither<T>[]>
      >;
  /**
   * Wraps a Promise.all call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<T[]>>}
   */
  all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]:
    TEitherMode extends "standard"
        ? StandardEither<Awaited<T[P]>>
        : TEitherMode extends "tuple"
            ? TupleEither<Awaited<T[P]>>
            : TEitherMode extends "go"
                ? GoEither<Awaited<T[P]>>
                : AnyEither<Awaited<T[P]>>; }>;

  /**
   * Wraps a Promise.race call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<T>>}
   */
  race<T>(values: Iterable<T | PromiseLike<T>>): Promise<
      TEitherMode extends "standard"
          ? Awaited<StandardEither<T>>
          : TEitherMode extends "tuple"
              ? Awaited<TupleEither<T>>
              : TEitherMode extends "go"
                  ?Awaited<GoEither<T>>
                  : Awaited<AnyEither<T>>
  >;
  /**
   * Wraps a Promise.race call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<T>>}
   */
  race<T extends readonly unknown[] | []>(values: T): Promise<
  TEitherMode extends "standard"
      ? Awaited<StandardEither<T[number]>>
      : TEitherMode extends "tuple"
      ? Awaited<TupleEither<T[number]>>
      : TEitherMode extends "go"
          ? Awaited<GoEither<T[number]>>
          : Awaited<AnyEither<T[number]>>
  >;

  /**
   * Wraps a Promise.allSettled call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<PromiseSettledResult<T>[]>>}
   */
  allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: TEitherMode extends "standard" ? StandardEither<PromiseSettledResult<Awaited<T[P]>>> : TEitherMode extends "tuple" ? TupleEither<PromiseSettledResult<Awaited<T[P]>>> : TEitherMode extends "go" ? GoEither<PromiseSettledResult<Awaited<T[P]>>> : AnyEither<PromiseSettledResult<Awaited<T[P]>>> ; }>;

  /**
   * Wraps a Promise.allSettled call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<PromiseSettledResult<T>[]>>}
   */
  allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;

  /**
   * Wraps a Promise.any call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<T>>}
   */
  any<T extends readonly unknown[] | []>(values: T): Promise<TEitherMode extends "standard" ? StandardEither<Awaited<T[number]>> : TEitherMode extends "tuple" ? TupleEither<Awaited<T[number]>> : TEitherMode extends "go" ? GoEither<Awaited<T[number]>> : AnyEither<Awaited<T[number]>>>;
  /**
   * Wraps a Promise.any call in a mightFail function.
   * @param values
   * @template T The type of the resolved values
   * @returns {Promise<Either<T>>}
   */
  any<T>(values: Iterable<T | PromiseLike<T>>): Promise<TEitherMode extends "standard" ? StandardEither<Awaited<T>> : TEitherMode extends "tuple" ? TupleEither<Awaited<T>> : TEitherMode extends "go" ? GoEither<Awaited<T>> : AnyEither<Awaited<T>>>;
}
