import { type Either } from "./Either"
import { Fail, Might, mightFail, mightFailSync } from "./mightFail"

/**
 * Utility type that unwraps a Promise type. If T is a Promise, it extracts the type the Promise resolves to,
 * providing direct access to the underlying value type.
 *
 * @template T The type to be unwrapped if it's a Promise.
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Wraps a promise-returning function in another function that instead of returning a Promise directly,
 * returns a Promise that resolves with an Either. This allows for the handling of both resolved values and
 * errors in a consistent, functional way.
 *

 * @template T The function type that returns a Promise.
 * @param {T} func - The async function to be wrapped. This function should return a Promise.
 * @return {Function} A new function that, when called, returns a Promise that resolves with an Either object.
 * The Either object contains either a 'result' with the resolved value of the original Promise, or an 'error' if the Promise was rejected.
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
 * const safeFetchData = makeMightFail(fetchData);
 * const {error, result} = await safeFetchData('https://example.com');
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return
 * }
 * console.log('Fetched data:', result);
 */
export function either<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...funcArgs: Parameters<T>) => Promise<Either<UnwrapPromise<ReturnType<T>>>> {
  return async (...args: Parameters<T>) => {
    const promise = func(...args)
    return mightFail(promise)
  }
}

/**
 * Wraps a synchronous function that might throw an exception in another function that,
 * instead of throwing, returns an Either object. This object contains either a 'result'
 * with the value returned by the function if it executes successfully, or an 'error' if the function throws.
 *

 * @template T The function type that might throw an error.
 * @param {T} func - The function to be wrapped. This function might throw an exception.
 * @return {Function} A new function that, when called, returns an Either object with either a 'result' or an 'error'.
 *
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * function parseJSON(jsonString: string) {
 *   return JSON.parse(jsonString); // This might throw
 * }
 *
 * const safeParseJSON = makeMightFailSync(parseJSON);
 * const {error, result} = safeParseJSON('{"valid": "json"}');
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
type ExcludeFail<T> = Exclude<T, ReturnType<typeof Fail>>;
type ExcludeError<T> = Exclude<T, ReturnType<typeof Error>>;
export function eitherSync<T extends (...args: any[]) => any>(
  func: T
): (...funcArgs: Parameters<T>) => Either<ExcludeError<ExcludeFail<ReturnType<T>>>> {
  return (...args: Parameters<T>) => {
    const result = func(...args)
    if (result.hasOwnProperty("error") && result.hasOwnProperty("result")) {
      return result
    }
    if (result instanceof Error) {
      return Fail(result)
    }
    return Might(result)
  }
}

const doThing = eitherSync(({name}: {name: string}) => {
  if (name === "John") {
    // return Fail("No John's allowed")
    return Error("No John's allowed")
  }
  return {
    name
  }
})

const [error, result] = doThing({name: "John"})

if (!error) {
  console.log(result) // { name: string }
} else {
  console.error(error) // Error
}
