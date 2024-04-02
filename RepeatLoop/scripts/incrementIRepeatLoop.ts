import { Address, toNano } from "@ton/core";
import { RepeatLoop } from "../wrappers/RepeatLoop";
import { NetworkProvider, sleep } from "@ton/blueprint";

export async function run(provider: NetworkProvider, args: string[]) {
  const ui = provider.ui();

  const address = Address.parse(
    args.length > 0 ? args[0] : await ui.input("IfStatement address"),
  );

  if (!(await provider.isContractDeployed(address))) {
    ui.write(`Error: Contract at address ${address} is not deployed!`);
    return;
  }

  const ifStatement = provider.open(RepeatLoop.createFromAddress(address));

  const counterBefore = await ifStatement.getCounter();

  await ifStatement.sendIncrease(provider.sender(), {
    increaseBy: 5,
    value: toNano("0.05"),
  });

  ui.write("Waiting for counter to increase...");

  let counterAfter = await ifStatement.getCounter();
  let attempt = 1;
  while (counterAfter === counterBefore) {
    ui.setActionPrompt(`Attempt ${attempt}`);
    await sleep(2000);
    counterAfter = await ifStatement.getCounter();
    attempt++;
  }

  ui.clearActionPrompt();
  ui.write("Counter increased successfully!");
}
