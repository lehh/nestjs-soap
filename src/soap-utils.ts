import { ServiceUnavailableException } from '@nestjs/common';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';

export async function createSoapClient(option: SoapModuleOptions): Promise<Client> {
  const client = await createClientAsync(option.uri, option.clientOptions)?.catch(err => { 
    throw new ServiceUnavailableException(err)
  })

  if (option.auth) {
    const basicAuth: ISecurity = new BasicAuthSecurity(
      option.auth.username,
      option.auth.password,
    );

    client.setSecurity(basicAuth);
  }

  return client
}