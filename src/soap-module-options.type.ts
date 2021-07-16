import { IOptions } from 'soap';
import { ModuleMetadata, Type } from '@nestjs/common';

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
  createSoapModuleOptions(): Promise<SoapModuleOptions[]> | SoapModuleOptions[];
}

export interface SoapModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<SoapModuleOptionsFactory>;
  useExisting?: Type<SoapModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SoapModuleOptions[]> | SoapModuleOptions[];
}
