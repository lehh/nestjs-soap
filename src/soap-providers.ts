import { FactoryProvider, Provider, Type } from '@nestjs/common';
import { createClientAsync, Client } from 'soap';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import {
  SoapModuleAsyncOptions,
  SoapModuleOptions,
  SoapModuleOptionsFactory,
} from './soap-module-options.type';

export const buildProvider = (soapOption: SoapModuleOptions): FactoryProvider => ({
  provide: soapOption.name,
  useFactory: async (): Promise<Client> => {
    return await createClientAsync(soapOption.uri, soapOption.clientOptions);
  },
});

export const buildProvidersAsync = (soapOptions: SoapModuleOptions[]): FactoryProvider[] =>
  soapOptions.map(buildProvider);

export const createAsyncProviders = (options: SoapModuleAsyncOptions[]): Provider[] => {
  return options.map(option => {
    if (option.useExisting || option.useFactory) {
      return createAsyncOptionsProvider(option);
    }

    const useClass = option.useClass as Type<SoapModuleOptionsFactory>;

    return {
      ...createAsyncOptionsProvider(option),
      provide: useClass,
      useClass,
    };
  });
};

export const createAsyncOptionsProvider = (options: SoapModuleAsyncOptions): Provider => {
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
