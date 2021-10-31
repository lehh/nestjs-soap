import { INestApplication, Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SoapModuleOptionsFactory } from './soap-module-options.type'
import { SoapModule } from './';

describe('SoapModule (integration)', () => {
  const MY_SOAP_URI = 'http://my.soap.websl';

  describe("Dynamic modules", () => {
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
          client: "REGISTER"
        })
      );

      const moduleFixture = await Test.createTestingModule({
        imports: [
          SoapModule.forRoot(
            {
              clientName: MY_SOAP_CLIENT_FOR_ROOT,
              uri: MY_SOAP_URI
            }
          ),
          SoapModule.register({
            clientName: MY_SOAP_CLIENT_REGISTER,
            uri: MY_SOAP_URI
          })
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
  
    test('should be able to get the soapClient using register', async () => {
      expect(app.get(MY_SOAP_CLIENT_REGISTER)).toEqual(
        expect.objectContaining({
          client: "REGISTER"
        })
      )
    });
  })

  describe("Asynchronous dynamic modules", () => {
    let app: INestApplication;
    
    // use a config service to test the forRootAsync
    @Injectable()
    class MySoapClientForRootAsyncConfig implements SoapModuleOptionsFactory {
      createSoapModuleOptions () {
        return {
          uri: "this.config.uri"
        }
      }
    } 

    beforeAll(async () => {
      mocked(createClientAsync).mockResolvedValue(
        // @ts-ignore
        Promise.resolve({
          client: "FOR_ROOT_ASYNC"
        })
      )

      const moduleFixture = await Test.createTestingModule({
        imports: [
          SoapModule.forRootAsync(
            {
              useClass: MySoapClientForRootAsyncConfig,
              clientName: "MY_USE_CLASS_FOR_ROOT_CONNECTION"
            },
          ),
          SoapModule.forRootAsync(
            {
              useFactory: () => ({
                uri: 'my.wsdl.uri'
              }),
              clientName: "MY_FACTORY_FOR_ROOT_CONNECTION"
            },
          ),
          SoapModule.registerAsync(
            {
              useClass: MySoapClientForRootAsyncConfig,
              clientName: "MY_USE_CLASS_REGISTER_CONNECTION"
            },
          ),
          SoapModule.registerAsync(
            {
              useFactory: () => ({
                uri: 'my.wsdl.uri'
              }),
              clientName: "MY_FACTORY_REGISTER_CONNECTION"
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
  
    test('should be able to get the client using forRootAsync useClass', async () => {
      expect(app.get("MY_USE_CLASS_FOR_ROOT_CONNECTION")).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT_ASYNC"
        })
      )
    });

    test('should be able to get the client using forRootAsync useFactory', async () => {
      expect(app.get("MY_FACTORY_FOR_ROOT_CONNECTION")).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT_ASYNC"
        })
      )
    });

    test('should be able to get the client using registerAsync useClass', async () => {
      expect(app.get("MY_USE_CLASS_REGISTER_CONNECTION")).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT_ASYNC"
        })
      )
    });

    test('should be able to get the client using registerAsync useFactory', async () => {
      expect(app.get("MY_FACTORY_REGISTER_CONNECTION")).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT_ASYNC"
        })
      )
    });
  })
});