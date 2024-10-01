import { type Either } from "./Either";
import { handleError } from "./utils";

/**
 * Wraps a promise in an Either to safely handle both its resolution and rejection. This function
 * takes a Promise of type T and returns a Promise which resolves with an object. This object
 * either contains a 'result' of type T if the promise resolves successfully, or an 'error' of type Error
 * if the promise is rejected.
 *
 * @export
 * @template T The type of the result value.
 * @param {Promise<T>} promise - The promise to be wrapped in an Either. This is an asynchronous operation that
 * should resolve with a value of type T or reject with an Error.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either. This Either is a Success<T> with
 * the 'result' property set to the value resolved by the promise if successful, and 'error' as undefined.
 * In case of failure, it's a Failure with 'result' as undefined and 'error' of type Error. `error` will **always** be an instance of Error.
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
export async function mightFail<T>(promise: Promise<T>): Promise<Either<T>> {
  try {
    const result = await promise;
    return { error: undefined, result };
  } catch (err) {
    const error = handleError(err);
    return { error, result: undefined };
  }
}

/**
 * Wraps a synchronous function in an Either type to safely handle exceptions. This function
 * executes a provided function that returns a value of type T, capturing any thrown errors.
 * It returns an object that either contains a 'result' of type T if the function succeeds,
 * or an 'error' of type Error if the function throws an error.
 *
 * @export
 * @template T The type of the result value.
 * @param {() => T} func - A wrapper function that is expected to invoke the throwing function.
 *  That function should return a value of type T or throw an error.
 * @return {Either<T>} An object that is either a Success<T> with the result property set to the value returned by `func`,
 *                     or a Failure with the error property set to the caught error. Success<T> has a 'result' of type T
 *                     and 'error' as null. Failure has 'result' as null and 'error' of type Error.
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

export function mightFailSync<T>(func: () => T): Either<T> {
  try {
    const result = func();
    return { error: undefined, result };
  } catch (err) {
    const error = handleError(err);
    return { error, result: undefined };
  }
}

/**
 * Wraps a Promise.all call in a mightFail function.
 *
 * @export
 * @template T The type of the resolved values
 * @param {Iterable<T | PromiseLike<T>>} values An iterable of promises
 * @return {Either<T[]>} A `Promise` that resolves with an Either object which has a 'result' property as Success<T[]>
 * set to the values resolved by the promise if successful, and 'error' property as undefined.
 * In case of failure, it's a Failure with 'result' as undefined and 'error' of type `Error`. `error` will **always** be an instance of `Error`.
 * The error value will be the first error encountered in the `Promise.all` call.
 *
 * @example
 * // Example of wrapping a Promise.all call in a mightFail function:
 * const {error, result} = await mightFail.all([Promise.resolve(1), Promise.reject(new Error("error"))]);
 *
 * if (error) {
 *   console.error('Promise.all failed:', error.message);
 *   return;
 * }
 * console.log('Promise.all resolved:', result);
 */
mightFail.all = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<T[]>> {
  return mightFail(Promise.all(values));
};

/**
 * Wraps a Promise.race call in a mightFail function.
 *
 * @export
 * @template T The type of the resolved values
 * @param {Iterable<T | PromiseLike<T>>} values An iterable of promises
 * @return {Promise<Either<T>>} A `Promise` that resolves with an Either object which has a property 'result' as Success<T>
 * set to the value resolved by the Promise.race if successful, and 'error' as undefined.
 * In case of failure, it's a Failure with 'result' as undefined and 'error' of type `Error`. `error` will **always** be an instance of `Error`.
 * The error will be the first error encountered in the `Promise.race` call.
 *
 * @example
 * // Example of wrapping a Promise.race call in a mightFail function:
 * const {error, result} = await mightFail.race([Promise.resolve(1), Promise.reject(new Error("error"))]);
 *
 * if (error) {
 *   console.error('Promise.race failed:', error.message);
 *   return;
 * }
 * console.log('Promise.race resolved:', result);
 */
mightFail.race = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<T>> {
  return mightFail(Promise.race(values));
};

/**
 * Wraps a Promise.allSettled call in a mightFail function.
 *
 * @export
 * @template T The type of the resolved values
 * @param {Iterable<T | PromiseLike<T>>} values The values to be resolved
 * @return {Promise<Either<PromiseSettledResult<T>[]>>} A `Promise` that resolves with an `Either` which has a `Success<PromiseSettledResult<T>[]>` with
 * the 'result' property set to the value resolved by the promise if successful, and 'error' as undefined.
 * This method will always resolve with an array of `PromiseSettledResult` objects, even if some of the promises in the iterable are rejected.
 * Hence, the error property will always be undefined.
 *
 * @example
 * // Example of wrapping a Promise.allSettled call in a mightFail function:
 * const {result: settledPromises} = await mightFail.allSettled([Promise.resolve(1), Promise.reject(new Error("error"))]);
 *
 * console.log('Promise.allSettled resolved:', settledPromises);
 */
mightFail.allSettled = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<PromiseSettledResult<T>[]>> {
  return mightFail(Promise.allSettled(values));
};

/**
 * Wraps a Promise.any call in a mightFail function.
 *
 * @export
 * @template T The type of the resolved values
 * @param {Iterable<T | PromiseLike<T>>} values The values to be resolved
 * @return {Promise<Either<T>>} A `Promise` that resolves with an `Either` which has a `Success<T>` with
 * the 'result' property set to the value resolved by the promise if successful, and 'error' as undefined.
 * In case of failure, it's a Failure with 'result' as undefined and 'error' of type `Error`. `error` will **always** be an instance of `Error`.
 *
 * This method will reject only if all the promises in the iterable are rejected.
 *
 * @example
 * // Example of wrapping a Promise.any call in a mightFail function:
 * const {error, result} = await mightFail.any([Promise.resolve(1), Promise.reject(new Error("error"))]);
 *
 * if (error) {
 *   console.error('Promise.any failed:', error.message);
 *   return;
 * }
 * console.log('Promise.any resolved:', result);
 */
mightFail.any = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<T>> {
  return mightFail(Promise.any(values));
};
