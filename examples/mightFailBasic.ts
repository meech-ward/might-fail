import { mightFail } from "../src/mightFail";

async function main() {
  const { error, result } = await mightFail(
    Promise.resolve({ message: "success" })
  );
  if (error) {
    console.error(error);
    return;
  }
  console.log(result.message);
}

main();
