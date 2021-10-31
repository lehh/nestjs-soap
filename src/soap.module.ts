import { DynamicModule, Module } from '@nestjs/common';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
import { buildAsyncProviders, buildClientProvider } from './soap-providers';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { SoapService } from './soap.service';

@Module({
  providers: [SoapService],
  exports: [SoapService],
})
export class SoapModule {
  static register(soapOptions: SoapModuleOptions): DynamicModule {
    return this.buildDynamicModule(soapOptions);
  }

  static forRoot(soapOptions: SoapModuleOptions): DynamicModule {
    return this.buildDynamicModule(soapOptions);
  }

  static registerAsync(soapOptions: SoapModuleAsyncOptions): DynamicModule {
    return this.buildAsyncDynamicModule(soapOptions);
  }

  static forRootAsync(soapOptions: SoapModuleAsyncOptions): DynamicModule {
    return this.buildAsyncDynamicModule(soapOptions);
  }

  private static buildDynamicModule(soapOptions: SoapModuleOptions): DynamicModule {
    const clientProvider = buildClientProvider(soapOptions.clientName);
    const optionsProvider = {
      provide: SOAP_MODULE_OPTIONS,
      useValue: soapOptions,
    };

    return {
      module: SoapModule,
      providers: [
        optionsProvider,
        clientProvider,
        SoapService,
      ],
      exports: [clientProvider, SoapService],
    };
  }

  private static buildAsyncDynamicModule(soapOptions: SoapModuleAsyncOptions): DynamicModule {
    const clientProvider = buildClientProvider(soapOptions.clientName);
    const asyncOptionsProviders = buildAsyncProviders(soapOptions);

    return {
      module: SoapModule,
      providers: [...asyncOptionsProviders, clientProvider, SoapService],
      exports: [...asyncOptionsProviders, clientProvider, SoapService],
      imports: soapOptions.imports || [],
    };
  }
}
