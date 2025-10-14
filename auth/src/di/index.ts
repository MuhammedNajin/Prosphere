import { bindRepositories } from './repositories';
import { bindControllers } from './controllers';
import { bindServices } from './services';
import container from './container';
import { bindMessageBroker } from './message-brokers';
import { bindUseCases } from './usecases';
import { bindConnections } from './connections';
import { bindCommon } from './common';


export const resolve = <T>(identifier: symbol): T => {
    console.log(`Resolving dependency: ${identifier.toString()}`);
    console.log(container.isBound(identifier) ? 'Dependency is bound.' : 'Dependency is NOT bound.');
    return container.get<T>(identifier);
}

export const  initializeDependencies = async () =>{
    console.log('Initializing dependencies...');
    await bindConnections(container);
    bindRepositories(container);
    bindServices(container);
    bindCommon(container)
    bindUseCases(container);
    bindControllers(container);
    bindMessageBroker(container);
}