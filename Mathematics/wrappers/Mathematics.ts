import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MathematicsConfig = { counter: number };

export function mathematicsConfigToCell(config: MathematicsConfig): Cell {
    return beginCell().storeUint(config.counter, 32).endCell();
}

export class Mathematics implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Mathematics(address);
    }

    static createFromConfig(config: MathematicsConfig, code: Cell, workchain = 0) {
        const data = mathematicsConfigToCell(config);
        const init = { code, data };
        return new Mathematics(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendRaiseN(
        provider: ContractProvider,
        via: Sender,
        opts: {
            inputNumber: number;
            value: bigint;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(opts.inputNumber, 32).endCell(),
        });
    }

    async sendRandom(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).storeUint(1, 32).endCell(),
        });
    }

    async sendCurrentTime(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(3, 32).storeUint(1, 32).endCell(),
        });
    }

    async sendModuloOperations(
        provider: ContractProvider,
        via: Sender,
        opts: {
            xp: bigint;
            zp: bigint;
            value: bigint;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(4, 32).storeUint(opts.xp, 256).storeUint(opts.zp, 256).endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }
}
