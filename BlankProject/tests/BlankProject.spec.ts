import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { BlankProject } from '../wrappers/BlankProject';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('BlankProject', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('BlankProject');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let blankProject: SandboxContract<BlankProject>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        blankProject = blockchain.openContract(BlankProject.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await blankProject.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: blankProject.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and blankProject are ready to use
    });
});
