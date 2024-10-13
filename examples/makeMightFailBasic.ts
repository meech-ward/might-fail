import { makeMightFail, makeMightFailSync } from "../src/makeMightFail"

const resolve = (value: { message: string }) => Promise.resolve(value)
async function asyncMain() {
  const func = makeMightFail(resolve)
  const { error, result } = await func({ message: "success" })
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

asyncMain()


function syncMain() {
  const parseJSON = makeMightFailSync(JSON.parse)

  const [error, result] = parseJSON("{invalid}")
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
} 

syncMain()