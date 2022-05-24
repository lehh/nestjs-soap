import { IOptions } from 'soap';
import { ModuleMetadata, Type } from '@nestjs/common';

export { Client, IOptions } from 'soap';

export type BasicAuth = {
  type?: string
  username: string;
  password: string;
};

export type WSSecurityType = {
  type: string
  username: string;
  password: string;
  options?: WSSecurityOptions;
};

export type WSSecurityOptions = {
  passwordType?: string;
  hasTimeStamp?: boolean;
  hasTokenCreated?: boolean;
  hasNonce?: boolean;
  mustUnderstand?: boolean,
  actor?: string;
};

export type SoapModuleOptions = {
  uri: string;
  clientName: string;
  auth?: BasicAuth | WSSecurityType;
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
