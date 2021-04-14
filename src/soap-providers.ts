import { FactoryProvider } from '@nestjs/common';
import { createClientAsync, Client } from 'soap';
import { SoapModuleOptions } from './soap-module-options.type';

export const buildProvidersAsync = (soapOptions: SoapModuleOptions[]): FactoryProvider[] => {
  return soapOptions.map(
    (soapOption): FactoryProvider => ({
      provide: soapOption.name,
      useFactory: async (): Promise<Client> => {
        return await createClientAsync(soapOption.uri);
      },
    }),
  );
};
