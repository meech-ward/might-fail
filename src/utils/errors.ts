export function handleError<E extends Error = Error>(error: unknown): E {
  if (error instanceof Error) {
    return error as E
  }
  if (typeof error === "string") {
    return createErrorWithoutMightFailStackTraces(error) as E
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return createErrorWithoutMightFailStackTraces(error.message) as E
    }
    return createErrorWithoutMightFailStackTraces(error as any) as E
  }
  return createErrorWithoutMightFailStackTraces("Unknown error") as E
}

function createErrorWithoutMightFailStackTraces(message: any): Error {
  const error = new Error(message)

  const stack = error.stack?.split("\n")
  stack?.splice(1, 3)
  error.stack = stack?.join("\n")

  return error
}
