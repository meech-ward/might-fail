import type {Either as StandardEither} from "./Either";
import type {Either as TupleEither} from "./tuple";
import type {Either as GoEither} from "./go";

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
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Awaited<Either<T[]>>>
     */
    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<
        TEitherMode extends "standard"
            ? Awaited<StandardEither<T[]>>
            : TEitherMode extends "tuple"
                ? Awaited<TupleEither<T[]>>
                : TEitherMode extends "go"
                    ? Awaited<GoEither<T[]>>
                    : Awaited<AnyEither<T[]>>
    >;

    /**
     * Wraps a Promise.all call in a mightFail function.
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Either<{ -readonly [P in keyof T]: Awaited<T[P]>; }>>
     */
    all<T extends readonly unknown[] | []>(values: T):
        Promise<
            TEitherMode extends "standard"
                ? StandardEither<{ -readonly [P in keyof T]: Awaited<T[P]>; }>
                : TEitherMode extends "tuple"
                    ? TupleEither<{ -readonly [P in keyof T]: Awaited<T[P]>; }>
                    : TEitherMode extends "go"
                        ? GoEither<{ -readonly [P in keyof T]: Awaited<T[P]>; }>
                        : AnyEither<{ -readonly [P in keyof T]: Awaited<T[P]>; }>
        >;

    /**
     * Wraps a Promise.race call in a mightFail function.
     *
     * @params values - An iterable of promises
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Awaited<Either<T>>>
     */
    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<
        TEitherMode extends "standard"
            ? Awaited<StandardEither<T>>
            : TEitherMode extends "tuple"
                ? Awaited<TupleEither<T>>
                : TEitherMode extends "go"
                    ? Awaited<GoEither<T>>
                    : Awaited<AnyEither<T>>
    >;

    /**
     * Wraps a Promise.race call in a mightFail function.
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Awaited<Either<T[number]>>>
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
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Either<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>}>>
     */
    allSettled<T extends readonly unknown[] | []>(values: T): Promise<
        TEitherMode extends "standard"
            ? StandardEither<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>
            : TEitherMode extends "tuple"
                ? TupleEither<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>
                : TEitherMode extends "go"
                    ? GoEither<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>
                    : AnyEither<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>
    >;

    /**
     * Wraps a Promise.allSettled call in a mightFail function.
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Either<PromiseSettledResult<Awaited<T>>[]>>
     */
    allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<
        TEitherMode extends "standard"
            ? StandardEither<PromiseSettledResult<Awaited<T>>[]>
            : TEitherMode extends "tuple"
                ? TupleEither<PromiseSettledResult<Awaited<T>>[]>
                : TEitherMode extends "go"
                    ? GoEither<PromiseSettledResult<Awaited<T>>[]>
                    : AnyEither<PromiseSettledResult<Awaited<T>>[]>
    >;

    /**
     * Wraps a Promise.any call in a mightFail function.
     *
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Either<Awaited<T[number]>>>
     */
    any<T extends readonly unknown[] | []>(values: T): Promise<TEitherMode extends "standard" ? StandardEither<Awaited<T[number]>> : TEitherMode extends "tuple" ? TupleEither<Awaited<T[number]>> : TEitherMode extends "go" ? GoEither<Awaited<T[number]>> : AnyEither<Awaited<T[number]>>>;

    /**
     * Wraps a Promise.any call in a mightFail function.
     *
     * @params values
     * @template T The type of the resolved values
     * @return {Promise} - Promise<Either<Awaited<T>>>
     */
    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<TEitherMode extends "standard" ? StandardEither<Awaited<T>> : TEitherMode extends "tuple" ? TupleEither<Awaited<T>> : TEitherMode extends "go" ? GoEither<Awaited<T>> : AnyEither<Awaited<T>>>;
}
