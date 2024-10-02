/**
 * Either type represents a tuple that encapsulates a successful result or an Error.
 *
 * `[Error, undefined]` represents a failed result.
 * `[undefined, T]` represents a successful result.
 *
 * It wraps the result of a Promise in an object, making it easier to handle errors by returning
 * an array that either contains a 'result' value of type T (if successful), or an 'error' of type Error.
 *
 * @template T The type of the result value.
 */
export type Either<T> = [Error, undefined] | [undefined, T]
