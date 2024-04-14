import { toNano } from '@ton/core';
import { SendingMessages } from '../wrappers/SendingMessages';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sendingMessages = provider.open(SendingMessages.createFromConfig({}, await compile('SendingMessages')));

    await sendingMessages.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sendingMessages.address);

    // run methods on `sendingMessages`
}
