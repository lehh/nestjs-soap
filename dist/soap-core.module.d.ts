import { ModuleRef } from '@nestjs/core';
import { DynamicModule, OnModuleInit, Provider } from '@nestjs/common';
import { SoapModuleOptions } from './soap-module-options.type';
export declare class SoapCoreModule implements OnModuleInit {
    private readonly moduleRef;
    static soapModuleConfig: SoapModuleOptions[];
    constructor(moduleRef: ModuleRef);
    static forRootAsync(providers: Provider[]): DynamicModule;
    onModuleInit(): void;
}
