import { toNano } from "@ton/core";
import { RepeatLoop } from "../wrappers/RepeatLoop";
import { compile, NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  const repeatLoop = provider.open(
    RepeatLoop.createFromConfig({
      id: Math.floor(Math.random() * 10000),
      counter: 2,
    }, await compile("RepeatLoop")),
  );

  await repeatLoop.sendDeploy(provider.sender(), toNano("0.05"));

  await provider.waitForDeploy(repeatLoop.address);

  console.log("ID", await repeatLoop.getID());
}
