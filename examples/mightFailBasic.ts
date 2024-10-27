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

function someResponse() {
  const responses = [
    { status: 200, data: { id: 1, name: "John Doe" }, json: async () => ({ status: 200, data: { id: 1, name: "John Doe" } }) },
    { status: 404, error: "Not Found", json: async () => ({ status: 404, error: "Not Found" }) },
    { status: 500, error: "Internal Server Error", json: async () => ({ status: 500, error: "Internal Server Error" }) },
    { status: 201, data: { id: 2, name: "Jane Smith", created: true }, json: async () => ({ status: 201, data: { id: 2, name: "Jane Smith", created: true } }) },
    { status: 400, error: "Bad Request", details: ["Invalid email", "Password too short"], json: async () => ({ status: 400, error: "Bad Request", details: ["Invalid email", "Password too short"] }) },
  ];

  const randomIndex = Math.floor(Math.random() * responses.length);
  const randomResponse = responses[randomIndex];

  return randomResponse;
}

async function main2() {
  const res = someResponse()
  const [error, result] = await mightFail(res.json())
  if (error) {
    console.error(error)
    return
  }
  console.log(result)
}

main2()

