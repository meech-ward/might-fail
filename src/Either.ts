type Either<T> = Promise<{
  error?: Error
  result?: T
}>

export default Either
