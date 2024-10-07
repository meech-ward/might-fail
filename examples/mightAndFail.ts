import { mightFail, Fail, type Either, makeMightFail, Might } from "../src"

export async function someFunction(
  promise1: Promise<string | null> = Promise.resolve("success"),
  promise2: Promise<number> = Promise.resolve(1)
): Promise<Either<{ stuff: boolean }>> {
  const [error1, result1] = await mightFail(promise1)
  if (error1) {
    return Fail(error1)
  }
  if (result1 === null) {
    return Fail(new Error("Could not get the the thing."))
  }

  return Might({ stuff: true })

  // const [error2] = await mightFail(promise2)
  // if (error2) {
  //   return [error2, undefined]
  // }

  // return [undefined, { stuff: true }]
}

// async function _someFunction(
//   promise1: Promise<string | null> = Promise.resolve("success"),
//   promise2: Promise<number> = Promise.resolve(1)
// ) {
//   const [error1, result1] = await mightFail(promise1)
//   if (error1) {
//     throw error1
//   }
//   if (result1 === null) {
//     throw new Error("Could not get the the thing.")
//   }

//   const [error2] = await mightFail(promise2)
//   if (error2) {
//     throw error2
//   }

//   return { stuff: true }
// }

// export const someFunction = makeMightFail(_someFunction)


async function something(): Promise<Either<string>> {
  const [error, result] = await mightFail(Promise.resolve("success"))
  if (error) {
    return Fail(error)
  }
  return Might(result)
}
