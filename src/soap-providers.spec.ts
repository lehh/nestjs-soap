import { Test } from '@nestjs/testing';
import { SoapModuleOptions, SoapModuleAsyncOptions } from './soap-module-options.type';
import { buildProvidersAsync, createAsyncProviders } from './soap-providers';
import { Provider } from '@nestjs/common';

import { Client, createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SOAP_MODULE_OPTIONS } from './soap-constants';

jest.mock('soap');
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

  describe('buildProvidersAsync', () => {
    it('Should map soap module options to providers', () => {
      const result = buildProvidersAsync(options);

      const expectedResult = [
        { provide: options[0].name, useFactory: expect.any(Function) },
        { provide: options[1].name, useFactory: expect.any(Function) },
      ] as Provider[];

      expect(result).toEqual(expectedResult);
    });

    it('Should create client and return it on useFactory', async () => {
      const providers = buildProvidersAsync(options);

      await providers[0].useFactory();

      expect(createClientAsyncMock).toBeCalledWith(options[0].uri, options[0].clientOptions);
    });

    it('Should pass clientOptions to createClient', async () => {
      const providers = buildProvidersAsync(options);

      await providers[1].useFactory();

      expect(createClientAsyncMock).toBeCalledWith(options[1].uri, options[1].clientOptions);
    });
  });

  describe('createAsyncProviders', () => {
    it('Should map soap module options to async providers', () => {
      const result = createAsyncProviders(optionsAsync);

      const expectedResult = [
        { provide: SOAP_MODULE_OPTIONS, inject: [], useFactory: expect.any(Function) },
        {
          provide: optionsAsync[1].useClass,
          inject: [optionsAsync[1].useClass],
          useClass: optionsAsync[1].useClass,
          useFactory: expect.any(Function),
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
