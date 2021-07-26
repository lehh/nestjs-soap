import { Client } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';
export declare function createSoapClient(options: SoapModuleOptions): Promise<Client>;
