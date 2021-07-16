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
  const soapClientConnectionProvider = {
    provide: options.connectionName,
    useFactory: async (options: SoapModuleOptions) => createSoapClient(options),
    inject: [
      SOAP_MODULE_OPTIONS
    ]
  }

  if (options.useExisting || options.useFactory) {
    return [
      soapClientConnectionProvider,
      _createAsyncOptionsProvider(options),
    ];
  }
  const useClass = options.useClass as Type<SoapModuleOptionsFactory>;

  return [
    soapClientConnectionProvider,
    _createAsyncOptionsProvider(options),
    {
      provide: useClass,
      useClass,
    },
  ];
};

const _createAsyncOptionsProvider = (options: SoapModuleAsyncOptions): Provider => {
  if (options.useFactory) {
    return {
      inject: options.inject || [],
      provide: SOAP_MODULE_OPTIONS,
      useFactory: options.useFactory,
    };
  }

  const inject = [(options.useClass || options.useExisting) as Type<SoapModuleOptionsFactory>];

  return {
    provide: SOAP_MODULE_OPTIONS,
    useFactory: async (optionsFactory: SoapModuleOptionsFactory) =>
      await optionsFactory.createSoapModuleOptions(),
    inject,
  };
};
