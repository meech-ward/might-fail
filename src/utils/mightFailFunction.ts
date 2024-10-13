import { type Either } from "../Either"
import { handleError } from "./errors"
import { createEither } from "./createEither"
import { MightFailFunction } from "./utils.type"

export const mightFailFunction: MightFailFunction<"standard"> = async function <T>(
  promise: Promise<T>
): Promise<Either<T>> {
  try {
    const result = await promise
    return createEither<T>({ result, error: undefined })
  } catch (err) {
    const error = handleError(err)
    return createEither<T>({ error, result: undefined })
  }
}