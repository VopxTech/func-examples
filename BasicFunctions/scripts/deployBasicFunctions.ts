import { toNano } from '@ton/core';
import { BasicFunctions } from '../wrappers/BasicFunctions';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const basicFunctions = provider.open(
        BasicFunctions.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('BasicFunctions'),
        ),
    );

    await basicFunctions.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(basicFunctions.address);

    console.log('ID', await basicFunctions.getID());
}
