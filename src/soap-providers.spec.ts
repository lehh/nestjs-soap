import { SoapModuleOptions } from './soap-module-options.type';
import { buildProvidersAsync } from './soap-providers';
import { Provider } from '@nestjs/common';

import { createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';

jest.mock('soap');
const createClientAsyncMock = mocked(createClientAsync);

describe('SoapProviders', () => {
  let options: SoapModuleOptions[];

  beforeEach(() => {
    options = [
      {
        name: 'first',
        uri: 'http://abcd.com',
      },
      {
        name: 'second',
        uri: 'http://efgh.com',
      },
    ] as SoapModuleOptions[];
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

      expect(createClientAsyncMock).toBeCalledWith(options[0].uri);
    });
  });
});
