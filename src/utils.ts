
export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "string") {
    return new Error(error);
  }
  if (typeof error === "object" && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return new Error(error.message);
    }
    return new Error(error as any);
  }
  return new Error("Unknown error");
}