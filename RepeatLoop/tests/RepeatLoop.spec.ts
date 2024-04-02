import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Cell, toNano } from "@ton/core";
import { RepeatLoop } from "../wrappers/RepeatLoop";
import "@ton/test-utils";
import { compile } from "@ton/blueprint";

describe("RepeatLoop", () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile("RepeatLoop");
  });

  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let repeatLoop: SandboxContract<RepeatLoop>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    repeatLoop = blockchain.openContract(RepeatLoop.createFromConfig({
      id: Math.floor(Math.random() * 10000),
      counter: 2,
    }, code));

    deployer = await blockchain.treasury("deployer");

    const deployResult = await repeatLoop.sendDeploy(
      deployer.getSender(),
      toNano("0.05"),
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: repeatLoop.address,
      deploy: true,
      success: true,
    });
  });

  it("should increase counter", async () => {
    const increaser = await blockchain.treasury("increaserby2");

    const counterBefore = await repeatLoop.getCounter();

    console.log("counter before increasing", counterBefore);

    const increaseBy = 5;

    console.log("increasing by", increaseBy);

    const increaseResult = await repeatLoop.sendIncrease(
      increaser.getSender(),
      {
        increaseBy,
        value: toNano("0.05"),
      },
    );

    expect(increaseResult.transactions).toHaveTransaction({
      from: increaser.address,
      to: repeatLoop.address,
      success: true,
    });

    const counterAfter = await repeatLoop.getCounter();

    console.log("counter after increasing", counterAfter);

    let finalAmount = counterBefore;

    for (let i = 0; i < increaseBy; i++) {
      /*

        int increase_by = in_msg_body~load_uint(32);
        int multiplier = 2;

        repeat(increase_by) {
            ctx_counter *= multiplier;
        }

        */
      finalAmount *= 2;
    }

    expect(counterAfter).toBe(finalAmount);
  });
});
