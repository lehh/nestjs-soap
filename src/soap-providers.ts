import { FactoryProvider, Provider, Type } from '@nestjs/common';
import { createClientAsync, Client } from 'soap';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import {
  SoapModuleAsyncOptions,
  SoapModuleOptions,
  SoapModuleOptionsFactory,
} from './soap-module-options.type';
import { SoapService } from './soap.service';

export const buildClientProvider = (soapOptions: SoapModuleOptions): FactoryProvider => ({
  provide: soapOptions.name,
  useFactory: async (soapService: SoapService) => {
    return await soapService.createAsyncClient()
  },
  inject: [SoapService]
})

export const createAsyncProviders = (options: SoapModuleAsyncOptions[]): Provider[] => {
  const asyncProviders: Provider[] = [];

  for (let option of options) {
    asyncProviders.push(...createAsyncProvider(option));
  }

  return asyncProviders;
}

const createAsyncProvider = (option: SoapModuleAsyncOptions): Provider[] => {
  if (option.useClass) return createUseClassProvider(option);
  if (option.useExisting) return createUseExistingProvider(option);
  if (option.useFactory) return createUseFactoryProvider(option);
}

const createUseClassProvider = (option: SoapModuleAsyncOptions): Provider[] => {
    const useClass = option.useClass as Type<SoapModuleOptionsFactory>;

    return [
      {
        provide: SOAP_MODULE_OPTIONS,
        useFactory: async (optionsFactory: SoapModuleOptionsFactory) =>
          await optionsFactory.createSoapModuleOptions(),
        inject: [useClass],
      },
      {
        provide: useClass,
        useClass,
      },
    ];
}

const createUseExistingProvider = (option: SoapModuleAsyncOptions): Provider[] => {
  return [
    {
      provide: SOAP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: SoapModuleOptionsFactory) =>
        await optionsFactory.createSoapModuleOptions(),
      inject: [option.useExisting],
    }
  ]
}

const createUseFactoryProvider = (option: SoapModuleAsyncOptions): Provider[] => {
  return [
    {
      provide: SOAP_MODULE_OPTIONS,
      useFactory: option.useFactory,
      inject: option.inject || [],
    },
  ];
}
