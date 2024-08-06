import { toNano } from '@ton/core';
import { Mathematics } from '../wrappers/Mathematics';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mathematics = provider.open(
        Mathematics.createFromConfig({ counter: Date.now() }, await compile('Mathematics')),
    );

    await mathematics.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(mathematics.address);

    console.log(`Deployed at ${mathematics.address}.`);
}
