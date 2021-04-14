import { DynamicModule, Module } from '@nestjs/common';
import { SoapModuleOptions } from './soap-module-options.type';
import { buildProvidersAsync } from './soap-providers';

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
}
