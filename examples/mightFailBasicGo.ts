import { mightFail } from "../src/go";

async function main() {
  const [error, result] = await mightFail(
    Promise.resolve({ message: "success" })
  );
  if (error) {
    console.error(error);
    return;
  }
  console.log(result.message);
}

main();
