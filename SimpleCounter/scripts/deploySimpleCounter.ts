import { toNano } from '@ton/core';
import { SimpleCounter } from '../wrappers/SimpleCounter';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const simpleCounter = provider.open(
        SimpleCounter.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('SimpleCounter')
        )
    );

    await simpleCounter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(simpleCounter.address);

    console.log('ID', await simpleCounter.getID());
}
