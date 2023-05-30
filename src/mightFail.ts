import Either from "./Either"

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
