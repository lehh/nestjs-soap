import { SoapModuleOptions, SoapModuleAsyncOptions } from './soap-module-options.type';
import { buildClientProvider, createAsyncProviders } from './soap-providers';
import { FactoryProvider, Provider } from '@nestjs/common';

import { createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { SoapService } from './soap.service';

const createClientAsyncMock = mocked(createClientAsync);

describe('SoapProviders', () => {
  let option: SoapModuleOptions;
  let options: SoapModuleOptions[];

  let optionsAsync: SoapModuleAsyncOptions[];

  beforeEach(() => {
    options = [
      {
        name: 'first',
        uri: 'http://abcd.com',
      },
      {
        name: 'second',
        uri: 'http://efgh.com',
        clientOptions: { disableCache: true },
      },
    ] as SoapModuleOptions[];
    option = options[0];

    optionsAsync = [
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
      const result = buildClientProvider(option);

      const expectedResult = {
        provide: option.name,
        useFactory: async (soapService: SoapService) => {
          return await soapService.createAsyncClient()
        },
        inject: [SoapService]
      } as FactoryProvider;

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
  });

  describe('createAsyncProviders', () => {
    it('Should map soap module options to async providers', () => {
      const result = createAsyncProviders(optionsAsync);

      const expectedResult = [
        { provide: SOAP_MODULE_OPTIONS, inject: [], useFactory: expect.any(Function) },
        {
          provide: SOAP_MODULE_OPTIONS,
          inject: [optionsAsync[1].useClass],
          useFactory: expect.any(Function),
        },
        {
          provide: optionsAsync[1].useClass,
          useClass: optionsAsync[1].useClass,
        },
        {
          provide: SOAP_MODULE_OPTIONS,
          inject: [optionsAsync[2].useExisting],
          useFactory: expect.any(Function),
        },
      ] as Provider[];

      expect(result).toEqual(expectedResult);
    });
  });
});
