import { IOptions } from 'soap';
import { ModuleMetadata, Scope, Type } from '@nestjs/common/interfaces';
import { BASIC_AUTH, WSSECURITY_AUTH } from './soap-constants';

export { Client, IOptions } from 'soap';

interface Auth {
  type: typeof BASIC_AUTH | typeof WSSECURITY_AUTH;
  username: string;
  password: string;
}

export interface BasicAuth extends Auth { }

export interface WSSecurityAuth extends Auth {
  options?: WSSecurityOptions
}

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
  auth?: BasicAuth | WSSecurityAuth;
  clientOptions?: IOptions;
};

export type SoapModuleOptionsFactoryType = Omit<SoapModuleOptions, 'clientName'>

export interface SoapModuleOptionsFactory {
  createSoapModuleOptions(): Promise<SoapModuleOptionsFactoryType> | SoapModuleOptionsFactoryType;
}

export interface SoapModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  clientName: string;
  inject?: any[];
  scope?: Scope;
  useClass?: Type<SoapModuleOptionsFactory>;
  useExisting?: Type<SoapModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SoapModuleOptionsFactoryType> | SoapModuleOptionsFactoryType;
}
