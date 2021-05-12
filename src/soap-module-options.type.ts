import { IOptions } from 'soap';

export type SoapModuleOptions = {
  uri: string;
  name: string;
  clientOptions?: IOptions;
};
