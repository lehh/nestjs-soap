import { INestApplication, Inject } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SoapModuleOptionsFactory } from './soap-module-options.type'
import { SoapModule } from './';

describe('SoapModule (integration)', () => {
  const MY_SOAP_URI = 'http://my.soap.websl';
  const MY_SOAP_CLIENT_PROVIDER_MOCK = {
    uri: 'http://my.soap.websl'
  }

  describe("forRoot", () => {
    const MY_SOAP_CLIENT_REGISTER = 'MY_SOAP_CLIENT_REGISTER';
    const MY_SOAP_CLIENT_FOR_ROOT = 'MY_SOAP_CLIENT_FOR_ROOT';
    let app: INestApplication;

    beforeAll(async () => {
      // mock the return value to be able to test security
      mocked(createClientAsync).mockResolvedValueOnce(
        // @ts-ignore
        Promise.resolve({
          setSecurity: jest.fn(),
          client: "FOR_ROOT"
        })
      ).mockResolvedValue(
        // @ts-ignore
        Promise.resolve({
          setSecurity: jest.fn(),
          client: "REGISTER_ASYNC"
        })
      );

      const moduleFixture = await Test.createTestingModule({
        imports: [
          SoapModule.forRoot([
            {
              connectionName: MY_SOAP_CLIENT_FOR_ROOT,
              uri: MY_SOAP_URI
            },
            {
              connectionName: MY_SOAP_CLIENT_REGISTER,
              uri: MY_SOAP_URI
            },
          ]),
        ],
      })
      .compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    test('should be able to get the soapClient using forRoot', async () => {
      expect(app.get(MY_SOAP_CLIENT_FOR_ROOT)).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT"
        })
      )
    });
  
    test('should be able to get the soapClient using registerAsync', async () => {
      expect(app.get(MY_SOAP_CLIENT_REGISTER)).toEqual(
        expect.objectContaining({
          client: "REGISTER_ASYNC"
        })
      )
    });
  })

  describe.skip("forRootAsync", () => {
    const MY_SOAP_CLIENT_FOR_ROOT_ASYNC = 'MY_SOAP_CLIENT_FOR_ROOT_ASYNC';
    const MY_CONFIG_SERVICE_PROVIDER = "MY_CONFIG_SERVICE_PROVIDER"
    let app: INestApplication;
    
    // use a config service to test the forRootAsync
    class MySoapClientForRootAsyncConfig implements SoapModuleOptionsFactory {
      constructor(@Inject(MY_CONFIG_SERVICE_PROVIDER) private readonly config: any) {}
      createSoapModuleOptions () {
        return [{
          uri: this.config.uri,
          connectionName: 'MY_SOAP_CLIENT_FOR_ROOT_ASYNC'
        }]
      }
    } 

    beforeAll(async () => {
      const moduleFixture = await Test.createTestingModule({
        providers: [
          {
            provide: MY_CONFIG_SERVICE_PROVIDER,
            useValue: MY_SOAP_CLIENT_PROVIDER_MOCK
          }
        ],
        imports: [
          SoapModule.forRootAsync(
            {
              useClass: MySoapClientForRootAsyncConfig
            },
          ),
        ],
      })
      .compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    test('should be able to get the service using forRootAsync', async () => {
      expect(app.get(MY_SOAP_CLIENT_FOR_ROOT_ASYNC)).toEqual(MY_SOAP_CLIENT_PROVIDER_MOCK)
    });

  })

});
