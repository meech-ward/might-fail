import { mightFail } from "../src"

async function success() {
  const [error, result] = await mightFail(Promise.resolve({ message: "success" }))
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

success()

async function error() {
  const [error, result] = await mightFail<{ message: string }>(Promise.reject("error"))
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

error()
