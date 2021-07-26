import { FactoryProvider, Provider, Type } from '@nestjs/common';
import { Client } from 'soap';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import {
  SoapModuleAsyncOptions,
  SoapModuleOptions,
  SoapModuleOptionsFactory,
} from './soap-module-options.type';
import { createSoapClient } from './soap-utils'

export const createProviders = (options: SoapModuleOptions[]): FactoryProvider[] => {
  return options.map(option => ({
    provide: option.connectionName,
    useFactory: async (): Promise<Client> => createSoapClient(option),
  }));
}

export const createAsyncProviders = (options: SoapModuleAsyncOptions): Provider[] => {
  if (options.useClass) {
    return createOptionsProviderClass(options)
  }

  return createOptionsProviderFactory(options)
};

const createOptionsProviderClass = (options: SoapModuleAsyncOptions) => {
  const useClass = options.useClass as Type<SoapModuleOptionsFactory>;

  return [
    getSoapClientConnectionProvider(options),
    createAsyncOptionsProvider(options),
    {
      provide: useClass,
      useClass,
    },
  ]
}

const createOptionsProviderFactory = (options: SoapModuleAsyncOptions) => {
  return [
    getSoapClientConnectionProvider(options),
    createAsyncOptionsProvider(options),
  ];
}

const getSoapClientConnectionProvider = (options: SoapModuleAsyncOptions): Provider => {
  return {
    provide: options.connectionName,
    useFactory: async (options: SoapModuleOptions) => createSoapClient(options),
    inject: [
      SOAP_MODULE_OPTIONS
    ]
  }
}

const createAsyncOptionsProvider = (options: SoapModuleAsyncOptions): Provider => {
  if (options.useFactory) {
    return getSoapModuleFactoryOptions(options)
  }

  return getSoapModuleClassOptions(options)
};

const getSoapModuleFactoryOptions = (options: SoapModuleAsyncOptions) => {
  return {
    inject: options.inject || [],
    provide: SOAP_MODULE_OPTIONS,
    useFactory: options.useFactory,
  };
}

const getSoapModuleClassOptions = (options: SoapModuleAsyncOptions): Provider => {
  return {
    provide: SOAP_MODULE_OPTIONS,
    useFactory: async (optionsFactory: SoapModuleOptionsFactory) => optionsFactory.createSoapModuleOptions(),
    inject: getDependencies(options),
  }
}

const getDependencies = (options: SoapModuleAsyncOptions) => {
  return [(options.useClass || options.useExisting) as Type<SoapModuleOptionsFactory>]
}
