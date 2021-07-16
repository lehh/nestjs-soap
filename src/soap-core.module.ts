import { ModuleRef } from '@nestjs/core';
import { DynamicModule, Module, OnModuleInit, Global, Provider } from '@nestjs/common';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { SoapModuleOptions } from './soap-module-options.type';

@Global()
@Module({})
export class SoapCoreModule implements OnModuleInit {
  static soapModuleConfig: SoapModuleOptions[];
  constructor(private readonly moduleRef: ModuleRef){}

  static forRootAsync(providers: Provider[]): DynamicModule {
    const resolvedProviders = SoapCoreModule.soapModuleConfig;

    console.log({ resolvedProviders })

    return {
      module: SoapCoreModule,
      exports: providers,
      providers,
    };
  }

  onModuleInit(){
      SoapCoreModule.soapModuleConfig = this.moduleRef.get(SOAP_MODULE_OPTIONS);
  }
}
