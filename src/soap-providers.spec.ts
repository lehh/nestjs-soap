import {
  SoapModuleOptions,
  SoapModuleAsyncOptions,
  SoapModuleOptionsFactory,
} from './soap-module-options.type';
import { buildAsyncProviders, buildClientProvider } from './soap-providers';
import { FactoryProvider } from '@nestjs/common';

import { createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { SoapService } from './soap.service';

const createClientAsyncMock = mocked(createClientAsync);

describe('SoapProviders', () => {
  let soapOptions: SoapModuleOptions;
  let soapOptionsAsync: SoapModuleAsyncOptions[];

  beforeEach(() => {
    soapOptions = {
      clientName: 'myclient',
      uri: 'http://efgh.com',
      clientOptions: { disableCache: true },
    } as SoapModuleOptions;

    const optionsFactory = {
      createSoapModuleOptions: () => soapOptions,
    } as SoapModuleOptionsFactory;

    soapOptionsAsync = [
      {
        clientName: 'first',
        useFactory: () => ({
          uri: 'http://abcd.com',
        }),
      },
      {
        clientName: 'second',
        useClass: optionsFactory,
      },
      {
        clientName: 'third',
        useExisting: optionsFactory,
      },
    ] as SoapModuleAsyncOptions[];
  });

  describe('buildClientProvider', () => {
    it('Should create soap async client provider', () => {
      const result = buildClientProvider(soapOptions.clientName);

      const expectedResult = {
        provide: soapOptions.clientName,
        useFactory: async (soapService: SoapService) => {
          return await soapService.createAsyncClient();
        },
        inject: [SoapService],
      } as FactoryProvider;

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });

  describe('buildAsyncProviders', () => {
    it('Should return an useFactory provider', () => {
      const result = buildAsyncProviders(soapOptionsAsync[0]);

      const expectedResult = [
        {
          provide: SOAP_MODULE_OPTIONS,
          inject: [],
          useFactory: expect.any(Function),
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it('Should return an useClass provider', () => {
      const result = buildAsyncProviders(soapOptionsAsync[1]);

      const expectedResult = [
        {
          provide: SOAP_MODULE_OPTIONS,
          inject: [soapOptionsAsync[1].useClass],
          useFactory: expect.any(Function),
        },
        {
          provide: soapOptionsAsync[1].useClass,
          useClass: soapOptionsAsync[1].useClass,
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it('Should return an useExisting provider', () => {
      const result = buildAsyncProviders(soapOptionsAsync[2]);

      const expectedResult = [
        {
          provide: SOAP_MODULE_OPTIONS,
          inject: [soapOptionsAsync[2].useExisting],
          useFactory: expect.any(Function),
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it('Should throw error when no option is provided', () => {
      const options = { clientName: 'Test' };

      return expect(() => buildAsyncProviders(options)).toThrowError();
    });
  });
});
