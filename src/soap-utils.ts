import { ServiceUnavailableException } from '@nestjs/common';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';

export default async function createSoapClient(options: SoapModuleOptions): Promise<Client> {
  const client = await createClientAsync(options.uri, options.clientOptions)?.catch(err => {
    throw new ServiceUnavailableException(err);
  });

  if (options.auth) {
    const basicAuth: ISecurity = new BasicAuthSecurity(
      options.auth.username,
      options.auth.password,
    );

    client.setSecurity(basicAuth);
  }

  return client;
}
