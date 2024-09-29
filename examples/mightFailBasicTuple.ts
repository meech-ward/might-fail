import { mightFail } from "../src/tuple";

async function main() {
  const [result, error] = await mightFail(
    Promise.resolve({ message: "success" })
  );
  if (error) {
    console.error(error);
    return;
  }
  console.log(result.message);
}

main();
