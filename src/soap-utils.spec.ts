import { DynamicModule, ServiceUnavailableException } from '@nestjs/common';
import { createSoapClient, concatImports } from './soap-utils';
import { createClientAsync, BasicAuthSecurity } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SoapModuleAsyncOptions } from 'src';

// mock the return value to be able to test security
const createClientAsyncMock = mocked(createClientAsync)
  .mockRejectedValueOnce(Promise.reject('some error!'))
  .mockResolvedValue(
    // @ts-ignore
    Promise.resolve({
      setSecurity: jest.fn(),
    }),
  );
const basicAuthSecurityMock = mocked(BasicAuthSecurity);

describe('SoapUtils', () => {
  describe('createSoapClient', () => {
    const SOAP_URI = 'my.soap.websl';
    const CLIENT_OPTIONS = {};

    test('should throw service error on connection issue', async () => {
      const SOAP_MODULE_OPTIONS = {
        uri: SOAP_URI,
        clientOptions: CLIENT_OPTIONS,
      };

      const expectToFailFn = () => createSoapClient(SOAP_MODULE_OPTIONS);

      return expect(expectToFailFn).rejects.toThrowError(ServiceUnavailableException);
    });

    test('should create a new client with credentials', async () => {
      const SOAP_MODULE_OPTIONS = {
        uri: SOAP_URI,
        clientOptions: CLIENT_OPTIONS,
      };

      await createSoapClient(SOAP_MODULE_OPTIONS);

      expect(createClientAsyncMock).toBeCalledWith(SOAP_URI, CLIENT_OPTIONS);
    });

    test('should create a new client without credentials', async () => {
      const SOAP_MODULE_OPTIONS = {
        uri: SOAP_URI,
        auth: {
          username: 'foo',
          password: 'bar',
        },
      };

      await createSoapClient(SOAP_MODULE_OPTIONS);

      expect(basicAuthSecurityMock).toBeCalledWith(
        SOAP_MODULE_OPTIONS.auth.username,
        SOAP_MODULE_OPTIONS.auth.password,
      );
    });
  });

  describe('concatImports', () => {
    it('Should return an array of imported modules', () => {
      const SomeModule = {} as DynamicModule;
      const SomeModule2 = {} as DynamicModule;

      const options = [
        {
          imports: [SomeModule, SomeModule2],
        },
        {
          imports: [SomeModule],
        },
        {
          name: 'option_without_imports',
        },
      ] as SoapModuleAsyncOptions[];

      const expectedResult = [SomeModule, SomeModule2, SomeModule];
      const result = concatImports(options);

      expect(result).toEqual(expectedResult);
    });

    it("Should return an empty array if there's no imports", () => {
      const options = [
        {
          name: 'option_without_imports',
        },
        {
          name: 'option_without_imports2',
        },
      ] as SoapModuleAsyncOptions[];

      const expectedResult = [];
      const result = concatImports(options);

      expect(result).toEqual(expectedResult);
    });
  });
});
