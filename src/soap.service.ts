import { Inject, Injectable, Logger } from '@nestjs/common';
import { SoapModuleOptions } from './soap-module-options.type';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity } from 'soap';

@Injectable()
export class SoapService {
  constructor(@Inject(SOAP_MODULE_OPTIONS) readonly soapModuleOptions: SoapModuleOptions) {}

  async createAsyncClient(): Promise<Client> {
    const options = this.soapModuleOptions;

    try {
      const client = await createClientAsync(options.uri, options.clientOptions);

      if (!options.auth) return client;

      const basicAuth: ISecurity = new BasicAuthSecurity(
        options.auth.username,
        options.auth.password,
      );

      client.setSecurity(basicAuth);

      return client;

    } catch (err) {
      const logger = new Logger('SoapModule');

      logger.error(
        `${err.message} \n - An error occurred while creating the soap client. Check the SOAP service URL and status.`,
      );

      return null;
    }
  }
}
