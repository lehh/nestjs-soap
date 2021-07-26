import { DynamicModule, Module } from '@nestjs/common';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
import { createProviders, createAsyncProviders } from './soap-providers';
import { SOAP_MODULE_INITIALIZATION, SOAP_MODULE_OPTIONS } from './soap-constants';

@Module({})
export class SoapModule {
  static registerAsync(soapOptions: SoapModuleOptions[]): DynamicModule {
    return this.forRoot(soapOptions)
  }

  static forRoot(soapOptions: SoapModuleOptions[]): DynamicModule {
    const providers = createProviders(soapOptions);

    return {
      module: SoapModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(soapOptions: SoapModuleAsyncOptions): DynamicModule {
    const providers = SoapModule.createAsyncProviders(soapOptions)

    return {
      module: SoapModule,
      exports: providers,
      providers,
    };
  }

  private static createAsyncProviders = (soapOptions: SoapModuleAsyncOptions) => {
    return [
      ...createAsyncProviders(soapOptions),
      {
        provide: SOAP_MODULE_INITIALIZATION,
        useFactory: (options: SoapModuleOptions[]) => options,
        inject: [
          SOAP_MODULE_OPTIONS
        ]
      },
    ]
  }
}
