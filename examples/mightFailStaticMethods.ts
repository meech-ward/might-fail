import { mightFail } from "../src"
import { mightFail as mightFailGo } from "../src/go"

async function all() {
  const { error, result } = await mightFail.all([
    Promise.resolve({ message: "success" }),
    Promise.resolve({ message: "success2" })
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.map((r) => r.message))
}

all()

async function allDifferentTypes() {
  const { error, result } = await mightFail.all([Promise.resolve({ message: "success" }), Promise.resolve(5)])
  if (error) {
    console.error(error)
    return
  }
  const [res1, res2] = result
  console.log(res1, res2)
}

allDifferentTypes()

async function allDestructured() {
  const { error, result: [result1, result2] = [] } = await mightFail.all([
    Promise.resolve({ message: "success" }),
    Promise.resolve(5)
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result1, result2)
}

allDestructured()

async function allTuple() {
  const [error, result] = await mightFail.all([
    Promise.resolve({ message: "success" }),
    Promise.resolve({ message: "success2" })
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.map((r) => r.message))
}

allTuple()

async function allTupleDestructured() {
  const [error, [result1, result2] = []] = await mightFail.all([
    Promise.resolve({ message: "success" }),
    Promise.resolve({ message: "success2" })
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result1, result2)
}

allTupleDestructured()

async function allGo() {
  const [result, error] = await mightFailGo.all([
    Promise.resolve({ message: "success" }),
    Promise.resolve({ message: "success2" })
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.map((r) => r.message))
}

allGo()

async function returnStringAfter(message: string, time: number) {
  await new Promise((resolve) => setTimeout(resolve, time))
  return { message }
}

async function race() {
  const { error, result } = await mightFail.race([returnStringAfter("fast", 100), returnStringAfter("slow", 200)])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

race()

async function any() {
  const { error, result } = await mightFail.any([
    Promise.reject(new Error("Failure 1")),
    returnStringAfter("success", 100),
    Promise.reject(new Error("Failure 2"))
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

any()

async function raceTuple() {
  const [error, result] = await mightFail.race([returnStringAfter("fast", 100), returnStringAfter("slow", 200)])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

raceTuple()

async function anyTuple() {
  const [error, result] = await mightFail.any([
    Promise.reject(new Error("Failure 1")),
    returnStringAfter("success", 100),
    Promise.reject(new Error("Failure 2"))
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

anyTuple()

async function raceGo() {
  const [result, error] = await mightFailGo.race([returnStringAfter("fast", 100), returnStringAfter("slow", 200)])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

raceGo()

async function anyGo() {
  const [result, error] = await mightFailGo.any([
    Promise.reject(new Error("Failure 1")),
    returnStringAfter("success", 100),
    Promise.reject(new Error("Failure 2"))
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log(result.message)
}

anyGo()

// Call all the new functions
race()
any()
raceTuple()
anyTuple()
raceGo()
anyGo()
