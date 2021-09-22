import { INestApplication, Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createClientAsync } from 'soap';
import { mocked } from 'ts-jest/utils';
import { SoapModuleOptionsFactory } from './soap-module-options.type'
import { SoapModule } from './';

describe('SoapModule (integration)', () => {
  const MY_SOAP_URI = 'http://my.soap.websl';

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
              name: MY_SOAP_CLIENT_FOR_ROOT,
              uri: MY_SOAP_URI
            },
            {
              name: MY_SOAP_CLIENT_REGISTER,
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

  describe("forRootAsync", () => {
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
          SoapModule.forRootAsync([
            {
              useClass: MySoapClientForRootAsyncConfig,
              name: "MY_CONNECTION"
            },
          ]),
          SoapModule.forRootAsync([
            {
              useFactory: () => ({
                uri: 'my.wsdl.uri'
              }),
              name: "MY_FACTORY_CONNECTION"
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
  
    test('should be able to get the client using forRootAsync useClass', async () => {
      expect(app.get("MY_CONNECTION")).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT_ASYNC"
        })
      )
    });

    test('should be able to get the client using forRootAsync useFactory', async () => {
      expect(app.get("MY_FACTORY_CONNECTION")).toEqual(
        expect.objectContaining({
          client: "FOR_ROOT_ASYNC"
        })
      )
    });
  })
});