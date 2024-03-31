import { toNano } from "@ton/core";
import { IfStatement } from "../wrappers/IfStatement";
import { compile, NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  const ifStatement = provider.open(
    IfStatement.createFromConfig(
      {
        id: Math.floor(Math.random() * 10000),
        counter: 0,
      },
      await compile("IfStatement"),
    ),
  );

  await ifStatement.sendDeploy(provider.sender(), toNano("0.05"));

  await provider.waitForDeploy(ifStatement.address);

  console.log("ID", await ifStatement.getID());
}
