import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Cell, toNano } from "@ton/core";
import { BasicFunctions } from "../wrappers/BasicFunctions";
import "@ton/test-utils";
import { compile } from "@ton/blueprint";

describe("BasicFunctions", () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile("BasicFunctions");
  });

  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let basicFunctions: SandboxContract<BasicFunctions>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    basicFunctions = blockchain.openContract(
      BasicFunctions.createFromConfig({
        id: Math.floor(Math.random() * 10000),
        counter: 2,
      }, code),
    );

    deployer = await blockchain.treasury("deployer");

    const deployResult = await basicFunctions.sendDeploy(
      deployer.getSender(),
      toNano("0.05"),
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: basicFunctions.address,
      deploy: true,
      success: true,
    });
  });

  it("IF Statement: should increase counter", async () => {
    const increaseTimes = 3;
    for (let i = 0; i < increaseTimes; i++) {
      console.log(`increase ${i + 1}/${increaseTimes}`);

      const increaser = await blockchain.treasury("increaser" + i);

      const counterBefore = await basicFunctions.getCounter();

      console.log("counter before increasing", counterBefore);

      const increaseBy = Math.floor(Math.random() * 100);

      console.log("increasing by", increaseBy);

      const increaseResult = await basicFunctions.sendIfStatement(
        increaser.getSender(),
        {
          increaseBy,
          value: toNano("0.05"),
        },
      );

      expect(increaseResult.transactions).toHaveTransaction({
        from: increaser.address,
        to: basicFunctions.address,
        success: true,
      });

      const counterAfter = await basicFunctions.getCounter();

      console.log("counter after increasing", counterAfter);

      expect(counterAfter).toBe(counterBefore + increaseBy);
    }
  });

  it("Repeat Loop: it should increase counter", async () => {
    const increaser = await blockchain.treasury("increaserby2");

    const counterBefore = await basicFunctions.getCounter();

    console.log("counter before increasing", counterBefore);

    const increaseBy = 5;

    console.log("increasing by", increaseBy);

    const increaseResult = await basicFunctions.sendRepeatLoop(
      increaser.getSender(),
      {
        increaseBy,
        value: toNano("0.05"),
      },
    );

    expect(increaseResult.transactions).toHaveTransaction({
      from: increaser.address,
      to: basicFunctions.address,
      success: true,
    });

    const counterAfter = await basicFunctions.getCounter();

    console.log("counter after increasing", counterAfter);

    let finalAmount = counterBefore;

    for (let i = 0; i < increaseBy; i++) {
      finalAmount *= 2;
    }

    expect(counterAfter).toBe(finalAmount);
  });

  it("While Loop: it should increase counter", async () => {
    const increaser = await blockchain.treasury("increaserby2");

    const counterBefore = await basicFunctions.getCounter();

    console.log("counter before increasing", counterBefore);

    const limit = 5;

    console.log("looping until", limit);

    const increaseResult = await basicFunctions.sendWhileLoop(
      increaser.getSender(),
      {
        limit,
        value: toNano("0.05"),
      },
    );

    expect(increaseResult.transactions).toHaveTransaction({
      from: increaser.address,
      to: basicFunctions.address,
      success: true,
    });

    const counterAfter = await basicFunctions.getCounter();

    console.log("counter after increasing", counterAfter);

    let finalAmount = counterBefore;

    while (counterBefore < limit) {
      finalAmount += 1;
    }

    expect(counterAfter).toBe(finalAmount);
  });
});
