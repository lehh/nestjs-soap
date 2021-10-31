import { Test, TestingModule } from '@nestjs/testing';
import { SoapService } from './soap.service';
import { mocked } from 'ts-jest/utils';
import { Client, createClientAsync } from 'soap';
import { MaybeMocked } from 'ts-jest/dist/utils/testing';
import { SoapModuleOptions } from 'src';
import { SOAP_MODULE_OPTIONS } from './soap-constants';
import { ServiceUnavailableException } from '@nestjs/common';

const soapModuleOptionsMock = {
  uri: 'some-uri',
  clientOptions: {},
  auth: {
    username: 'someUser',
    password: 'somePass',
  },
} as SoapModuleOptions;

const soapModuleOptionsProviderMock = () => soapModuleOptionsMock;

describe('SoapService', () => {
  let service: SoapService;
  let soapCreateClientAsyncMock: MaybeMocked<typeof createClientAsync>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoapService,
        {
          provide: SOAP_MODULE_OPTIONS,
          useFactory: soapModuleOptionsProviderMock,
        },
      ],
    }).compile();

    service = module.get<SoapService>(SoapService);

    soapCreateClientAsyncMock = mocked(createClientAsync);
  });

  describe('createAsyncClient', () => {
    let clientMock: Client;

    beforeEach(() => {
      clientMock = {} as Client;
      clientMock.setSecurity = jest.fn();
    });

    it('Should throw service unavailable on connection issue', () => {
      soapCreateClientAsyncMock.mockRejectedValue('some error');

      return expect(service.createAsyncClient()).rejects.toThrowError(ServiceUnavailableException);
    });

    it('Should create client with soap options data', async () => {
      const { uri, clientOptions } = soapModuleOptionsMock;
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(soapCreateClientAsyncMock).toBeCalledWith(uri, clientOptions);
    });

    it('Should not set security when auth is empty', async () => {
      const auth = soapModuleOptionsMock.auth;
      service.soapModuleOptions.auth = null;

      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(clientMock.setSecurity).not.toBeCalled();

      soapModuleOptionsMock.auth = auth;
    });

    it('Should set security when auth is not empty', async () => {
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(clientMock.setSecurity).toBeCalled();
    });

    it('Should return client', async () => {
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      const result = await service.createAsyncClient();

      expect(result).toEqual(clientMock);
    });
  });
});
