import { BasicAuthSecurity, Client, createClientAsync, ISecurity } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';

export default function createSoapClient(options: SoapModuleOptions): Promise<Client> {
  return createClientAsync(options.uri, options.clientOptions).then(Client => {
    if (options.auth) {
      const basicAuth: ISecurity = new BasicAuthSecurity(
        options.auth.username,
        options.auth.password,
      );
      Client.setSecurity(basicAuth);
    }

    return Client;
  });
}
