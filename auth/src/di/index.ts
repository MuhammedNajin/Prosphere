import { bindRepositories } from './repositories';
import { bindControllers } from './controllers';
import { bindServices } from './services';
import container from './container';
import { bindMessageBroker } from './message-brokers';
import { bindUseCases } from './usecases';


export const resolve = <T>(identifier: symbol): T => {
    console.log(`Resolving dependency: ${identifier.toString()}`);
    console.log(container.isBound(identifier) ? 'Dependency is bound.' : 'Dependency is NOT bound.');
    return container.get<T>(identifier);
}

export const  initializeDependencies = async () =>{
    console.log('Initializing dependencies...');
    bindRepositories(container);
    bindUseCases(container);
    bindControllers(container);
    bindMessageBroker(container);
    await bindServices(container);
}