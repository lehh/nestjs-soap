import { ServiceUnavailableException } from '@nestjs/common';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';

function setSecurityToClient(options: SoapModuleOptions, client: Client): void {
  if (!options.auth) {
    return
  }

  const basicAuth: ISecurity = new BasicAuthSecurity(
    options.auth.username,
    options.auth.password,
  );

  client.setSecurity(basicAuth);
}

export async function createSoapClient(options: SoapModuleOptions): Promise<Client> {
  const client = await createClientAsync(options.uri, options.clientOptions)?.catch(err => { 
    throw new ServiceUnavailableException(err)
  });

  setSecurityToClient(options, client)

  return client
}