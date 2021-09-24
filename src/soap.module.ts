import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
import { buildClientProvider, createAsyncProviders } from './soap-providers';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { SoapService } from './soap.service';
import createSoapClient from './soap-utils';

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

  static registerAsync(soapOptions: SoapModuleAsyncOptions[]): DynamicModule {
    const providers: Provider[] = soapOptions.map((soapOption) => ({
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

  static forRootAsync(soapOptions: SoapModuleAsyncOptions[]): DynamicModule {
    const providers: Provider[] = soapOptions.map((soapOption) => ({
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

  private static buildDynamicModule(soapOptions: SoapModuleOptions): DynamicModule {
    const clientProvider = buildClientProvider(soapOptions);

    return {
      module: SoapModule,
      providers: [
        { 
          provide: SOAP_MODULE_OPTIONS,
          useValue: soapOptions 
        },
        clientProvider,
        SoapService
      ],
      exports: [clientProvider, SoapService],
    };
  }
}
