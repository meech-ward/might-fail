import { mightFail } from "../src"

async function main() {
  const { error, result } = await mightFail(Promise.resolve({ message: "success" }))
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

main()
async function main2() {
  const result = await mightFail(Promise.resolve({ message: "success" }))
  console.log(result)
}

main2()

async function main3() {
  const result = await mightFail(Promise.reject(new Error("error")))
  console.log(result)
}

main3()
