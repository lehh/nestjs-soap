import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils';
import { BasicAuthSecurity, Client, createClientAsync, NTLMSecurity, WSSecurity } from 'soap';
import { MaybeMocked } from 'ts-jest/dist/utils/testing';

import { SoapModuleOptions } from './soap-module-options.type';
import { BASIC_AUTH, SOAP_MODULE_OPTIONS, WSSECURITY_AUTH, NTLM_AUTH } from './soap-constants';
import { SoapService } from './soap.service';

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

    it('Should return null on connection issue', () => {
      soapCreateClientAsyncMock.mockRejectedValue('some error');

      return expect(service.createAsyncClient()).resolves.toBeNull();
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

    it('Should use BasicAuthSecurity if auth.type is not defined', async () => {
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(clientMock.setSecurity).toBeCalledWith(expect.any(BasicAuthSecurity));
    });

    it('Should use BasicAuthSecurity if auth.type is BASIC_AUTH', async () => {
      const auth = soapModuleOptionsMock.auth;
      service.soapModuleOptions.auth.type = BASIC_AUTH;
      
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(clientMock.setSecurity).toBeCalledWith(expect.any(BasicAuthSecurity));
      
      soapModuleOptionsMock.auth = auth;
    });

    it('Should use WSSecurity if auth.type is WSSECURITY_AUTH', async () => {
      const auth = soapModuleOptionsMock.auth;
      service.soapModuleOptions.auth.type = WSSECURITY_AUTH;
      
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(clientMock.setSecurity).toBeCalledWith(expect.any(WSSecurity));
      
      soapModuleOptionsMock.auth = auth;
    });

    it('Should use NTLMSecurity if auth.type is NTLM_AUTH', async () => {
      const auth = soapModuleOptionsMock.auth;
      service.soapModuleOptions.auth.type = NTLM_AUTH;
      
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      await service.createAsyncClient();

      expect(clientMock.setSecurity).toBeCalledWith(expect.any(NTLMSecurity));
      
      soapModuleOptionsMock.auth = auth;
    });

    it('Should return client', async () => {
      soapCreateClientAsyncMock.mockResolvedValue(clientMock);

      const result = await service.createAsyncClient();

      expect(result).toEqual(clientMock);
    });
  });
});
