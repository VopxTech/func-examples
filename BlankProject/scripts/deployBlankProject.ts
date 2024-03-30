import { toNano } from '@ton/core';
import { BlankProject } from '../wrappers/BlankProject';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const blankProject = provider.open(BlankProject.createFromConfig({}, await compile('BlankProject')));

    await blankProject.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(blankProject.address);

    // run methods on `blankProject`
}
