import Either from "./Either"

/**
 * Wraps a promise in an Either. This function takes a Promise of type T and returns a Promise
 * which resolves with an object that either contains a 'result' of type T, or an 'error' of type Error.
 *
 * @export
 * @template T The type of the result value.
 * @param {Promise<T>} promise The promise to be wrapped in an Either.
 * @return {Either<T>} A Promise that resolves with an Either.
 */
export default function mightFail<T>(promise: Promise<T>): Either<T> {
  return promise
    .then((result) => ({ error: undefined, result }))
    .catch((error) => {
      if (error instanceof Error) {
        return { error, result: undefined }
      }
      return { error: new Error("Unknown error"), result: undefined }
    })
}
