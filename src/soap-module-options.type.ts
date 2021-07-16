import { IOptions } from 'soap';
import { ModuleMetadata, Type } from '@nestjs/common';
export { Client, IOptions } from 'soap';

export type BasicAuth = {
  username: string;
  password: string;
};

export type SoapModuleOptions = {
  uri: string;
  connectionName: string;
  auth?: BasicAuth;
  clientOptions?: IOptions;
};

export interface SoapModuleOptionsFactory {
  createSoapModuleOptions(): Promise<Omit<SoapModuleOptions, "connectionName">> | Omit<SoapModuleOptions, "connectionName">;
}

export interface SoapModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<SoapModuleOptionsFactory>;
  useExisting?: Type<SoapModuleOptionsFactory>;
  connectionName: string;
  useFactory?: (...args: any[]) => Promise<Omit<SoapModuleOptions, "connectionName">> | Omit<SoapModuleOptions, "connectionName">;
}
