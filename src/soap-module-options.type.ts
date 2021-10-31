import { IOptions } from 'soap';
import { ModuleMetadata, Type } from '@nestjs/common';

export { Client, IOptions } from 'soap';

export type BasicAuth = {
  username: string;
  password: string;
};

export type SoapModuleOptions = {
  uri: string;
  clientName: string;
  auth?: BasicAuth;
  clientOptions?: IOptions;
};

export type SoapModuleOptionsFactoryType = Omit<SoapModuleOptions, 'clientName'>

export interface SoapModuleOptionsFactory {
  createSoapModuleOptions(): Promise<SoapModuleOptionsFactoryType> | SoapModuleOptionsFactoryType;
}

export interface SoapModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  clientName: string;
  inject?: any[];
  useClass?: Type<SoapModuleOptionsFactory>;
  useExisting?: Type<SoapModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SoapModuleOptionsFactoryType> | SoapModuleOptionsFactoryType;
}
