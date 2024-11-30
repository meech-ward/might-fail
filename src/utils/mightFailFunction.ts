import { type Either } from "../Either"
import { handleError } from "./errors"
import { createEither } from "./createEither"
import { MightFailFunction } from "./utils.type"

export const mightFailFunction: MightFailFunction<"standard"> = async function <T>(
  promise: T
): Promise<Either<Awaited<T>>> {
  try {
    const result = await promise
    return createEither<Awaited<T>>({ result, error: undefined })
  } catch (err) {
    const error = handleError(err)
    return createEither<Awaited<T>>({ error, result: undefined })
  }
}