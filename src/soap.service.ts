import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AuthType,
  SSLPFXAuth,
  SoapModuleOptions,
  WSSecurityAuth,
} from './soap-module-options.type';
import { SOAP_MODULE_OPTIONS, SSL_PFX_AUTH, WSSECURITY_AUTH } from './soap-constants';
import {
  BasicAuthSecurity,
  Client,
  createClientAsync,
  ISecurity,
  WSSecurity,
  ClientSSLSecurityPFX,
} from 'soap';

@Injectable()
export class SoapService {
  constructor(@Inject(SOAP_MODULE_OPTIONS) readonly soapModuleOptions: SoapModuleOptions) {}

  async createAsyncClient(): Promise<Client> {
    const options = this.soapModuleOptions;

    try {
      const client = await createClientAsync(options.uri, options.clientOptions);

      if (!options.auth) return client;

      const authMethod = this.getAuthMethod(options.auth);

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

  private getAuthMethod(authOptions: AuthType): ISecurity {
    const { username, password, type } = authOptions;

    switch (type) {
      case WSSECURITY_AUTH:
        const WSSOptions = (authOptions as WSSecurityAuth).options;
        return new WSSecurity(username, password, WSSOptions);
      case SSL_PFX_AUTH:
        const SSLPFXOptions = (authOptions as SSLPFXAuth).options;
        const loginData = {
          pfx: SSLPFXOptions.pfx,
          passphrase: SSLPFXOptions.passphrase,
          ...SSLPFXOptions.defaults,
        };
        return new ClientSSLSecurityPFX(loginData);
      default:
        return new BasicAuthSecurity(username, password);
    }
  }
}
