import { bindRepositories } from './repositories';
import { bindControllers } from './controllers';
import { bindServices } from './services';
import container from './container';
import { bindMessageBroker } from './message-brokers';
import { bindUseCases } from './usecases';
import { bindConnections } from './connections';


export const resolve = <T>(identifier: symbol): T => {
    console.log(`Resolving dependency: ${identifier.toString()}`);
    console.log(container.isBound(identifier) ? 'Dependency is bound.' : 'Dependency is NOT bound.');
    return container.get<T>(identifier);
}

export const  initializeDependencies = async () =>{
    await bindConnections(container);
    bindRepositories(container);
    await bindServices(container);
    bindUseCases(container);
    bindControllers(container);
    bindMessageBroker(container);
}