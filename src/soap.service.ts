import { 
  createClientAsync,
  Client,
  BasicAuthSecurity,
  ISecurity,
  WSSecurity,
  NTLMSecurity 
} from 'soap';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthType, NTLMSecurityAuth, SoapModuleOptions, WSSecurityAuth } from './soap-module-options.type';
import { NTLM_AUTH, SOAP_MODULE_OPTIONS, WSSECURITY_AUTH } from './soap-constants';

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
        `An error occurred while creating the soap client. Check the SOAP service URL and status.`,
      );

      logger.error(err?.message, err);

      return null;
    }
  }

  private getAuthMethod(authOptions: AuthType): ISecurity {
    const { username, password, type } = authOptions;

    switch (type) {
      case WSSECURITY_AUTH:
        const WSSOptions = (authOptions as WSSecurityAuth).options;
        return new WSSecurity(username, password, WSSOptions);
      case NTLM_AUTH:
        const NTLMOptions = (authOptions as NTLMSecurityAuth).options;
        const loginData = {
          username,
          password,
          ...NTLMOptions
        };
        return new NTLMSecurity(loginData);
      default:
        return new BasicAuthSecurity(username, password);
    }
  }
}
