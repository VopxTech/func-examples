import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Mathematics } from '../wrappers/Mathematics';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Mathematics', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Mathematics');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let mathematics: SandboxContract<Mathematics>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        mathematics = blockchain.openContract(
            Mathematics.createFromConfig(
                {
                    counter: 0,
                },
                code,
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await mathematics.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: mathematics.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mathematics are ready to use
    });

    it('Nth Power: should increase counter', async () => {
        const increaser = await blockchain.treasury('increaserRandom');

        const counterBefore = await mathematics.getCounter();

        console.log('counter before increasing', counterBefore);

        const increaseBy = Math.floor(Math.random() * 100);

        console.log('increasing by', increaseBy);

        const increaseResult = await mathematics.sendRaiseN(increaser.getSender(), {
            inputNumber: increaseBy,
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: mathematics.address,
            success: true,
        });

        const counterAfter = await mathematics.getCounter();

        console.log('counter after increasing', counterAfter);

        expect(counterAfter).toBe(counterBefore + increaseBy ** 3);
    });

    it('Random: should increase counter', async () => {
        const increaser = await blockchain.treasury('increaserRandom');

        const counterBefore = await mathematics.getCounter();

        console.log('counter before increasing', counterBefore);

        const increaseResult = await mathematics.sendRandom(increaser.getSender(), {
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: mathematics.address,
            success: true,
        });

        const counterAfter = await mathematics.getCounter();

        console.log('counter after increasing', counterAfter);

        expect(counterAfter).toBeGreaterThan(counterBefore);
    });

    it('Current time: set counter to current time', async () => {
        const increaser = await blockchain.treasury('increaserTime');

        const counterBefore = await mathematics.getCounter();

        console.log('counter before increasing', counterBefore);

        const increaseResult = await mathematics.sendCurrentTime(increaser.getSender(), {
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: mathematics.address,
            success: true,
        });

        const counterAfter = Math.floor(Date.now() / 1000);

        console.log('counter after increasing', counterAfter);

        expect(counterAfter).toBeGreaterThan(counterBefore);
    });

    it('Modulo operations: should increase counter', async () => {
        const increaser = await blockchain.treasury('increaserModulo');

        const counterBefore = await mathematics.getCounter();

        console.log('counter before modulo operation', counterBefore);

        const xp = 1234567890; // Example 32-bit number
        const zp = 987654321; // Example 32-bit number
        const prime = 4294967291; // 2^32 - 5 (32-bit prime)

        const increaseResult = await mathematics.sendModuloOperations(increaser.getSender(), {
            xp,
            zp,
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: mathematics.address,
            success: true,
        });

        const counterAfter = await mathematics.getCounter();

        console.log('counter after modulo operation', counterAfter);

        expect(counterAfter).toBe(1181121056);
    });
});
