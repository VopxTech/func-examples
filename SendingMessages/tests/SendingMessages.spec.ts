import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SendingMessages } from '../wrappers/SendingMessages';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SendingMessages', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SendingMessages');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sendingMessages: SandboxContract<SendingMessages>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sendingMessages = blockchain.openContract(SendingMessages.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sendingMessages.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // blockchain and sendingMessages are ready to use
    });

    it('should send a simple message', async () => {
        const result = await sendingMessages.sendSimpleMessage(deployer.getSender(), toNano('0.05'));

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            success: true,
        });
    });

    it('should send a message with an incoming account', async () => {
        const result = await sendingMessages.sendIncomingAccount(deployer.getSender(), toNano('0.05'));

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            success: true,
        });
    });

    it('should send a message with the entire balance', async () => {
        const result = await sendingMessages.sendEntireBalance(deployer.getSender(), toNano('0.05'));

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            success: true,
        });
    });

    it('should send a message with long text', async () => {
        const result = await sendingMessages.sendLongText(deployer.getSender(), toNano('0.05'));

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            success: true,
        });
    });

    it('should send a message with body as slice', async () => {
        const result = await sendingMessages.sendBodyAsSlice(deployer.getSender(), toNano('0.05'));

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            success: true,
        });
    });

    it('should send a message with body as ref', async () => {
        const result = await sendingMessages.sendBodyAsRef(deployer.getSender(), toNano('0.05'));

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendingMessages.address,
            success: true,
        });
    });
});
