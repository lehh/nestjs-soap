import { FactoryProvider, Provider } from '@nestjs/common';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
export declare const createProviders: (options: SoapModuleOptions[]) => FactoryProvider[];
export declare const createAsyncProviders: (options: SoapModuleAsyncOptions) => Provider[];
