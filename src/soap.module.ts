import { DynamicModule, Module } from '@nestjs/common';
import { SoapCoreModule } from './soap-core.module';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
import { createProviders, createAsyncProviders } from './soap-providers';

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
    const providers = createAsyncProviders(soapOptions);

    return {
      imports: [
        SoapCoreModule.forRootAsync(providers)
      ],
      module: SoapModule,
      exports: providers,
      providers,
    };
  }
}
