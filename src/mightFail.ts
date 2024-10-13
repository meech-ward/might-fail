import { type Either } from "./Either"
import { makeProxyHandler } from "./utils/staticMethodsProxy"
import { handleError } from "./utils/errors"
import { createEither } from "./utils/createEither"
import { MightFail, NotUndefined } from "./utils/utils.type"
import { mightFailFunction } from "./utils/mightFailFunction"


/**
 * Wraps a promise in an Either to safely handle both its resolution and rejection. This function
 * takes a Promise of type T and returns a Promise which resolves with an object. This object
 * either contains a 'result' of type T if the promise resolves successfully, or an 'error' of type Error
 * if the promise is rejected.
 *
 * @template T The type of the result value.
 * @param {Promise<T>} promise - The promise to be wrapped in an Either. This is an asynchronous operation that
 * should resolve with a value of type T or reject with an Error.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either. This Either is a `Success<T>` with
 * the 'result' property set to the value resolved by the promise if successful, and 'error' as undefined.
 * In case of failure, it's a `Failure` with 'result' as undefined and 'error' of type Error. `error` will **always** be an instance of Error.
 *
 * @example
 * // Example of wrapping an async function that might fail:
 * async function fetchData(url: string): Promise<string> {
 *   const response = await fetch(url);
 *   if (!response.ok) {
 *     throw new Error('Network response was not ok');
 *   }
 *   return response.text();
 * }
 *
 * const {error, result} = await mightFail(fetchData('https://example.com'));
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return;
 * }
 * console.log('Fetched data:', result);
 */
export const mightFail: MightFail<"standard"> = new Proxy(
  mightFailFunction,
  makeProxyHandler(mightFailFunction)
) as MightFail<"standard">

/**
 * Wraps a synchronous function in an Either type to safely handle exceptions. This function
 * executes a provided function that returns a value of type T, capturing any thrown errors.
 * It returns an object that either contains a 'result' of type T if the function succeeds,
 * or an 'error' of type Error if the function throws an error.
 *
 * @template T The type of the result value.◊
 * @param {() => T} func - A wrapper function that is expected to invoke the throwing function.
 *  That function should return a value of type T or throw an error.
 * @return {Either<T>} An object that is either a `Success<T>` with the result property set to the value returned by `func`,
 *                     or a `Failure` with the error property set to the caught error. `Success<T>` has a 'result' of type T
 *                     and 'error' as null. `Failure` has 'result' as null and 'error' of type Error.
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * const {error, result} = mightFailSync(() => JSON.parse(""));
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
export const mightFailSync = function mightFailSync<T>(func: () => T): Either<T> {
  try {
    const result = func()
    return createEither<T>({ error: undefined, result })
  } catch (err) {
    const error = handleError(err)
    return createEither<T>({ error, result: undefined })
  }
}

/**
 * A pure constructor function that takes a non-null value and returns an `Either` object with the value as the result and undefined as the error.
 *
 * @param result
 */
export const Might = function Might<T>(result: NotUndefined<T>): Either<T> {
  return createEither<T>({ result, error: undefined })
}

/**
 * A constructor function that takes an error and returns an `Either` object with undefined as the result and the error as the error.
 *
 * The error will **always** be an instance of Error.
 *
 * @param error
 */
export const Fail = function Fail<T = any>(error: unknown): Either<T> {
  return createEither<T>({ result: undefined, error: handleError(error) })
}

