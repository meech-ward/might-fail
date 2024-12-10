import { type Either } from "../Either"
import { handleError } from "./errors"
import { createEither } from "./createEither"
import { MightFailFunction } from "./utils.type"

export const mightFailFunction: MightFailFunction<"standard"> = async function <T, E extends Error = Error>(
  promise: T
): Promise<Either<Awaited<T>, E>> {
  try {
    const result = await promise
    return createEither<Awaited<T>, E>({ result, error: undefined })
  } catch (err) {
    const error = handleError<E>(err)
    return createEither<Awaited<T>, E>({ error, result: undefined })
  }
}
