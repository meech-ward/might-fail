import type { Either as StandardEither } from "./Either";
import type { Either as TupleEither } from "./tuple";
import type { Either as GoEither } from "./go";

export type EitherMode = 'standard' | 'tuple' | 'go' | 'any';

export type AnyEither<T> = StandardEither<T> | TupleEither<T> | GoEither<T>;

export type MightFailFunction<TEitherMode extends EitherMode> = <T>(promise: Promise<T>) => Promise<
    TEitherMode extends 'standard' ? StandardEither<T> :
        TEitherMode extends 'tuple' ? TupleEither<T> :
            TEitherMode extends 'go' ? GoEither<T> :
                AnyEither<T>
>;

export type MightFail<TEitherMode extends EitherMode, TPromiseStaticMethods = PromiseStaticMethods<TEitherMode>> = MightFailFunction<TEitherMode> & TPromiseStaticMethods;

export interface PromiseStaticMethods<TEitherMode extends EitherMode> {
    /**
     * Wraps a Promise.all call in a mightFail function.
     * @param values
     * @template T The type of the resolved values
     * @returns {Promise<Either<T[]>>}
     */
    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<
        TEitherMode extends 'standard' ? StandardEither<T[]> :
            TEitherMode extends 'tuple' ? TupleEither<T[]> :
                TEitherMode extends 'go' ? GoEither<T[]> :
                    AnyEither<T[]>
    >;
    /**
     * Wraps a Promise.race call in a mightFail function.
     * @param values
     * @template T The type of the resolved values
     * @returns {Promise<Either<T>>}
     */
    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<
        TEitherMode extends 'standard' ? StandardEither<T> :
            TEitherMode extends 'tuple' ? TupleEither<T> :
                TEitherMode extends 'go' ? GoEither<T> :
                    AnyEither<T>
    >;
    /**
     * Wraps a Promise.allSettled call in a mightFail function.
     * @param values
     * @template T The type of the resolved values
     * @returns {Promise<Either<PromiseSettledResult<T>[]>>}
     */
    allSettled<T>(
        values: Iterable<T | PromiseLike<T>>
    ): Promise<
        TEitherMode extends 'standard' ? StandardEither<PromiseSettledResult<T>[]> :
            TEitherMode extends 'tuple' ? TupleEither<PromiseSettledResult<T>[]> :
                TEitherMode extends 'go' ? GoEither<PromiseSettledResult<T>[]> :
                    AnyEither<PromiseSettledResult<T>[]>
    >;
    /**
     * Wraps a Promise.any call in a mightFail function.
     * @param values
     * @template T The type of the resolved values
     * @returns {Promise<Either<T>>}
     */
    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<
        TEitherMode extends 'standard' ? StandardEither<T> :
            TEitherMode extends 'tuple' ? TupleEither<T> :
                TEitherMode extends 'go' ? GoEither<T> :
                    AnyEither<T>
    >;
}
