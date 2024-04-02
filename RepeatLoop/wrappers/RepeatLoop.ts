import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from "@ton/core";

export type RepeatLoopConfig = {
  id: number;
  counter: number;
};

export function repeatLoopConfigToCell(config: RepeatLoopConfig): Cell {
  return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32)
    .endCell();
}

export class RepeatLoop implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new RepeatLoop(address);
  }

  static createFromConfig(config: RepeatLoopConfig, code: Cell, workchain = 0) {
    const data = repeatLoopConfigToCell(config);
    const init = { code, data };
    return new RepeatLoop(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendIncrease(
    provider: ContractProvider,
    via: Sender,
    opts: {
      increaseBy: number;
      value: bigint;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32)
        .storeUint(opts.increaseBy, 32)
        .endCell(),
    });
  }

  async getCounter(provider: ContractProvider) {
    const result = await provider.get("get_counter", []);
    return result.stack.readNumber();
  }

  async getID(provider: ContractProvider) {
    const result = await provider.get("get_id", []);
    return result.stack.readNumber();
  }
}
