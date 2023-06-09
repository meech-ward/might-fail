/**
 * Either type represents a data structure that encapsulates a successful result or an Error.
 * It wraps the result of a Promise in an object, making it easier to handle errors by returning
 * an object that either contains a 'result' value of type T (if successful), or an 'error' of type Error.
 *
 * @template T The type of the result value.
 */
type Either<T> =
  | Promise<{
      error: Error;
      result: undefined;
    }>
  | Promise<{
      result: T;
      error: undefined;
    }>;

// export type SafeParseReturnType<Input, Output> =
//   | SafeParseSuccess<Output>
//   | SafeParseError<Input>;

// export type SafeParseSuccess<Output> = { success: true; data: Output };
// export type SafeParseError<Input> = { success: false; error: ZodError<Input> };

export default Either;
