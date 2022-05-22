import { Inject, Injectable, Logger } from '@nestjs/common';
import { SoapModuleOptions, WSSecurityType } from './soap-module-options.type';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity, WSSecurity } from 'soap';

@Injectable()
export class SoapService {
  constructor(@Inject(SOAP_MODULE_OPTIONS) readonly soapModuleOptions: SoapModuleOptions) {}

  async createAsyncClient(): Promise<Client> {
    const options = this.soapModuleOptions;

    try {
      const client = await createClientAsync(options.uri, options.clientOptions);

      if (!options.auth) return client;

      const {username, password} = options.auth;

      const authMethod: ISecurity = options.auth.type === 'WSSecurity'
        ? new WSSecurity(username, password, (options.auth as WSSecurityType).options)
        : new BasicAuthSecurity(username, password);

      client.setSecurity(authMethod);

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
