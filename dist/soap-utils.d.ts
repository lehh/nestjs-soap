import { Client } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';
export declare function createSoapClient(option: SoapModuleOptions): Promise<Client>;
export declare function createSoapClients(options: SoapModuleOptions[]): Promise<Client[]>;
