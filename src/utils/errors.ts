export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === "string") {
    return createErrorWithoutMightFailStackTraces(error)
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return createErrorWithoutMightFailStackTraces(error.message)
    }
    return createErrorWithoutMightFailStackTraces(error as any)
  }
  return createErrorWithoutMightFailStackTraces("Unknown error")
}

function createErrorWithoutMightFailStackTraces(message: any): Error {
  const error = new Error(message)

  const stack = error.stack?.split("\n")
  stack?.splice(1, 3)
  error.stack = stack?.join("\n")

  return error
}