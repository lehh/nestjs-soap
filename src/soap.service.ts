import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { SoapModuleOptions } from './soap-module-options.type';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity } from 'soap';

@Injectable()
export class SoapService {
  constructor(@Inject(SOAP_MODULE_OPTIONS) readonly soapModuleOptions: SoapModuleOptions) {}

  async createAsyncClient(): Promise<Client> {
    const options = this.soapModuleOptions;

    const client = await createClientAsync(options.uri, options.clientOptions)?.catch((err) => {
      throw new ServiceUnavailableException(err);
    });

    if (!options.auth) return client;

    const basicAuth: ISecurity = new BasicAuthSecurity(
      options.auth.username,
      options.auth.password,
    );

    client.setSecurity(basicAuth);

    return client;
  }
}
