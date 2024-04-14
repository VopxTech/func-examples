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
        // the check is done inside beforeEach
        // blockchain and sendingMessages are ready to use
    });
});
