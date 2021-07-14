import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SoapModuleOptionsFactory } from './soap-module-options.type'
import { SoapModule } from './';

describe('SoapModule (integration)', () => {
  let app: INestApplication;

  const MY_SOAP_URI = 'http://my.soap.websl';

  const MY_SOAP_CLIENT_REGISTER = 'MY_SOAP_CLIENT_REGISTER';
  const MY_SOAP_CLIENT_FOR_ROOT = 'MY_SOAP_CLIENT_FOR_ROOT';
  const MY_SOAP_CLIENT_FOR_ROOT_ASYNC = 'MY_SOAP_CLIENT_FOR_ROOT_ASYNC';

  const MY_SOAP_CLIENT_PROVIDER_MOCK = {
    uri: 'http://my.soap.websl'
  }

  // use a config service to test the forRootAsync
  class MySoapClientForRootAsyncConfig implements SoapModuleOptionsFactory {
    createSoapModuleOptions: () => ({
        uri: 'http://my.soap.websl'
    })
  } 

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        SoapModule.registerAsync([
            {
                name: MY_SOAP_CLIENT_REGISTER,
                uri: MY_SOAP_URI
            },
        ]),
        SoapModule.forRoot([
            {
                name: MY_SOAP_CLIENT_FOR_ROOT,
                uri: MY_SOAP_URI
            },
        ]),
        SoapModule.forRootAsync([
            {
                name: MY_SOAP_CLIENT_FOR_ROOT_ASYNC,
                useClass: MySoapClientForRootAsyncConfig
            },
        ]),
      ],
    })
    // prevent invoking create asyncClient from soap
    .overrideProvider(MY_SOAP_CLIENT_FOR_ROOT)
    .useValue(MY_SOAP_CLIENT_PROVIDER_MOCK)
    .overrideProvider(MY_SOAP_CLIENT_FOR_ROOT_ASYNC)
    .useValue(MY_SOAP_CLIENT_PROVIDER_MOCK)
    .overrideProvider(MY_SOAP_CLIENT_REGISTER)
    .useValue(MY_SOAP_CLIENT_PROVIDER_MOCK)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able to get the service using forRoot', async () => {
    expect(app.get(MY_SOAP_CLIENT_FOR_ROOT)).toEqual(MY_SOAP_CLIENT_PROVIDER_MOCK)
  });

  test('should be able to get the service using forRootAsync', async () => {
    expect(app.get(MY_SOAP_CLIENT_FOR_ROOT_ASYNC)).toEqual(MY_SOAP_CLIENT_PROVIDER_MOCK)
  });

  test('should be able to get the service using registerAsync', async () => {
    expect(app.get(MY_SOAP_CLIENT_REGISTER)).toEqual(MY_SOAP_CLIENT_PROVIDER_MOCK)
  });
});
