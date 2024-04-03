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

export type BasicFunctionsConfig = { id: number; counter: number };

export function basicFunctionsConfigToCell(config: BasicFunctionsConfig): Cell {
  return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32)
    .endCell();
}

export class BasicFunctions implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new BasicFunctions(address);
  }

  static createFromConfig(
    config: BasicFunctionsConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = basicFunctionsConfigToCell(config);
    const init = { code, data };
    return new BasicFunctions(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendIfStatement(
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

  async sendRepeatLoop(
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
        .storeUint(2, 32)
        .storeUint(opts.increaseBy, 32)
        .endCell(),
    });
  }

  async sendWhileLoop(
    provider: ContractProvider,
    via: Sender,
    opts: {
      limit: number;
      value: bigint;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(3, 32)
        .storeUint(opts.limit, 32)
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
