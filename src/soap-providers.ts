import { FactoryProvider, Provider, Type } from '@nestjs/common';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { SoapModuleAsyncOptions, SoapModuleOptionsFactory } from './soap-module-options.type';
import { SoapService } from './soap.service';

export const buildClientProvider = (clientName: string): FactoryProvider => ({
  provide: clientName,
  useFactory: async (soapService: SoapService) => await soapService.createAsyncClient(),
  inject: [SoapService],
});

export const buildAsyncProviders = (soapAsyncOptions: SoapModuleAsyncOptions): Provider[] => {
  const { useClass, useExisting, useFactory } = soapAsyncOptions;

  if (useClass) return createUseClassProvider(soapAsyncOptions);
  if (useExisting) return createUseExistingProvider(soapAsyncOptions);
  if (useFactory) return createUseFactoryProvider(soapAsyncOptions);

  throw new Error(
    '[SoapModule]: useClass, useExisting or useFactory must be filled when using async options.',
  );
};

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
};

const createUseExistingProvider = (option: SoapModuleAsyncOptions): Provider[] => {
  return [
    {
      provide: SOAP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: SoapModuleOptionsFactory) =>
        await optionsFactory.createSoapModuleOptions(),
      inject: [option.useExisting],
    },
  ];
};

const createUseFactoryProvider = (option: SoapModuleAsyncOptions): Provider[] => {
  return [
    {
      provide: SOAP_MODULE_OPTIONS,
      useFactory: option.useFactory,
      inject: option.inject || [],
    },
  ];
};
