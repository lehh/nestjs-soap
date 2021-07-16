import { DynamicModule } from '@nestjs/common';
import { SoapModuleAsyncOptions, SoapModuleOptions } from './soap-module-options.type';
export declare class SoapModule {
    static registerAsync(soapOptions: SoapModuleOptions[]): DynamicModule;
    static forRoot(soapOptions: SoapModuleOptions[]): DynamicModule;
    static forRootAsync(soapOptions: SoapModuleAsyncOptions): DynamicModule;
}
