import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type BlankProjectConfig = {};

export function blankProjectConfigToCell(config: BlankProjectConfig): Cell {
    return beginCell().endCell();
}

export class BlankProject implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new BlankProject(address);
    }

    static createFromConfig(config: BlankProjectConfig, code: Cell, workchain = 0) {
        const data = blankProjectConfigToCell(config);
        const init = { code, data };
        return new BlankProject(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
