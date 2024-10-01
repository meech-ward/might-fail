import standard from "../index";
import { type Either } from "./Either";
/**
 * Wraps a promise in an Either tuple to safely handle both its resolution and rejection. This function
 * takes a Promise of type T and returns a Promise which resolves with an Either tuple. This tuple
 * either contains an Error as the first element and undefined as the second if the promise is rejected,
 * or undefined as the first element and a 'result' of type T as the second if the promise resolves successfully.
 *
 * @export
 * @template T The type of the result value.
 * @param {Promise<T>} promise - The promise to be wrapped in an Either. This is an asynchronous operation that
 * should resolve with a value of type T or reject with an Error.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either tuple. This Either is [undefined, T] with
 * the second element set to the value resolved by the promise if successful. In case of failure, it's [Error, undefined]
 * with the first element being the Error. The Error will always be an instance of Error.
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
 * const [error, result] = await mightFail(fetchData('https://example.com'));
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return;
 * }
 * console.log('Fetched data:', result);
 */
export async function mightFail<T>(promise: Promise<T>): Promise<Either<T>> {
  const {result, error} = await standard.mightFail(promise);
  return error ? [error, undefined] : [undefined, result];
}

/**
 * Wraps a synchronous function in an Either tuple to safely handle exceptions. This function
 * executes a provided function that returns a value of type T, capturing any thrown errors.
 * It returns a tuple that either contains an Error as the first element and undefined as the second
 * if the function throws, or undefined as the first element and a value of type T as the second
 * if the function succeeds.
 *
 * @export
 * @template T The type of the result value.
 * @param {() => T} func - A wrapper function that is expected to invoke the throwing function.
 *  That function should return a value of type T or throw an error.
 * @return {Either<T>} A tuple that is either [undefined, T] with the second element set to the value returned by `func`,
 *                     or [Error, undefined] with the first element set to the caught error.
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * const [error, result] = mightFailSync(() => JSON.parse(""));
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
export function mightFailSync<T>(func: () => T): Either<T> {
  const {result, error} = standard.mightFailSync(func);
  return error ? [error, undefined] : [undefined, result];
}

/**
 * Wraps a Promise.all call in an Either tuple.
 *
 * @template T The type of the resolved values.
 * @param {Iterable<T | PromiseLike<T>>} values An iterable of promises.
 * @return {Promise<Either<T[]>>} A Promise that resolves with an Either tuple. If successful, it resolves as
 * [undefined, T[]]. If any promise fails, it returns [Error, undefined] where the error is the first rejection.
 */
mightFail.all = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<T[]>> {
  return mightFail(Promise.all(values));
};

/**
 * Wraps a Promise.race call in an Either tuple.
 *
 * @template T The type of the resolved values.
 * @param {Iterable<T | PromiseLike<T>>} values An iterable of promises.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either tuple. If successful, it resolves as
 * [undefined, T]. If the first promise fails, it returns [Error, undefined].
 */
mightFail.race = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<T>> {
  return mightFail(Promise.race(values));
};

/**
 * Wraps a Promise.allSettled call in an Either tuple.
 *
 * @template T The type of the resolved values.
 * @param {Iterable<T | PromiseLike<T>>} values An iterable of promises.
 * @return {Promise<Either<PromiseSettledResult<T>[]>>} A Promise that resolves with an Either tuple.
 * Since Promise.allSettled never rejects, the tuple will always be [undefined, PromiseSettledResult<T>[]].
 */
mightFail.allSettled = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<PromiseSettledResult<T>[]>> {
  return mightFail(Promise.allSettled(values));
};

/**
 * Wraps a Promise.any call in an Either tuple.
 *
 * @template T The type of the resolved values.
 * @param {Iterable<T | PromiseLike<T>>} values An iterable of promises.
 * @return {Promise<Either<T>>} A Promise that resolves with an Either tuple. If successful, it resolves as
 * [undefined, T]. If all promises fail, it returns [Error, undefined] where the error is an AggregateError.
 */
mightFail.any = function<T>(values: Iterable<T | PromiseLike<T>>): Promise<Either<T>> {
  return mightFail(Promise.any(values));
};

