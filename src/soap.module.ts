import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
import { buildProvidersAsync, createAsyncProviders } from './soap-providers';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import createSoapClient from './soap-utils';

@Module({})
export class SoapModule {
  static registerAsync(soapOptions: SoapModuleOptions[]): DynamicModule {
    const providers = buildProvidersAsync(soapOptions);

    return {
      module: SoapModule,
      providers: [...providers],
      exports: [...providers],
    };
  }

  static forRoot(soapOptions: SoapModuleOptions[]): DynamicModule {
    const providers = buildProvidersAsync(soapOptions);

    return {
      module: SoapModule,
      providers: [...providers],
      exports: [...providers],
    };
  }

  static forRootAsync(soapOptions: SoapModuleAsyncOptions[]): DynamicModule {
    const providers: Provider[] = soapOptions.map(soapOption => ({
      inject: [SOAP_MODULE_OPTIONS],
      provide: soapOption.name,
      useFactory: (options: SoapModuleOptions) => createSoapClient(options),
    }));

    const asyncProviders = createAsyncProviders(soapOptions);

    const exports = soapOptions.map(({ name }) => name);

    return {
      module: SoapModule,
      exports,
      providers: [...asyncProviders, ...providers],
    };
  }
}
