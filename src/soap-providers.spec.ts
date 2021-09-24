import { SoapModuleOptions, SoapModuleAsyncOptions } from './soap-module-options.type';
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
      name: 'myclient',
      uri: 'http://efgh.com',
      clientOptions: { disableCache: true },
    } as SoapModuleOptions;

    soapOptionsAsync = [
      {
        name: 'first',
        useFactory: () => ({
          uri: 'http://abcd.com',
        }),
      },
      {
        name: 'second',
        useClass: 'SoapClientSecond',
      },
      {
        name: 'third',
        useExisting: 'SoapClientThird',
      },
    ] as SoapModuleAsyncOptions[];
  });

  describe('buildClientProvider', () => {
    it('Should create soap async client provider', () => {
      const result = buildClientProvider(soapOptions.name);

      const expectedResult = {
        provide: soapOptions.name,
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
  });
});
