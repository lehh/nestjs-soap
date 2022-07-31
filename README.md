<a href="https://www.npmjs.com/nestjs-soap" target="_blank"><img src="https://img.shields.io/npm/v/nestjs-soap.svg?v2" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/nestjs-soap" target="_blank"><img src="https://img.shields.io/npm/l/nestjs-soap.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/nestjs-soap" target="_blank"><img src="https://img.shields.io/npm/dm/nestjs-soap.svg" alt="NPM Downloads" /></a>

# Nestjs Soap

### Nestjs module wrapper for [soap](https://www.npmjs.com/package/soap) npm package

## Compatibility

For nestjs < v8.4.0 use v2 package.

For nestjs >= v8.4.0 use v3 package.

## Install

```bash
npm install nestjs-soap
```
Or, if you use yarn
```bash
yarn add nestjs-soap
```

## Documentation

### [Upgrading to v2](./docs/upgrading-to-v2.md)
### [v1 docs](./docs/v1.md)

## Getting Started

After installing the package, just import the SoapModule on the module you want to use the soap client.  

```javascript
import { Module } from '@nestjs/common';
import { SoapModule } from 'nestjs-soap';

@Module({
  imports: [
    SoapModule.register(
      { clientName: 'MY_SOAP_CLIENT', uri: 'http://yourserver/yourservice.wso?wsdl' },
    ),
  ],
})
export class ExampleModule {}
```
The `register` or `forRoot` function receives a [SoapModuleOptions](#SoapModuleOptions) object. You can register as many clients as you need, each with an unique `clientName`.

Another way to import the SoapModule is using `forRootAsync` or `registerAsync`, like other [factory provider](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory). It receives a [SoapModuleAsyncOptions](#SoapModuleOptions) object. Our factory function can be `async` and can inject dependencies through `inject`:

```javascript
import { Module } from '@nestjs/common';
import { SoapModule, SoapModuleOptions } from 'nestjs-soap';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SoapModule.forRootAsync(
      { 
        clientName: 'MY_SOAP_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (
          configService: ConfigService,
        ): Promise<SoapModuleOptions> => ({
          uri: configService.get<string>('soap.uri'),
          auth: {
            type: 'basic',
            username: configService.get<string>('soap.username'),
            password: configService.get<string>('soap.password'),
          },
        }),        
      }
    ),
  ],
})
export class ExampleModule {}
```


Then, inject the client where you want to use it.
```javascript
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'nestjs-soap';

@Injectable()
export class ExampleService {
  constructor(@Inject('MY_SOAP_CLIENT') private readonly mySoapClient: Client) {}

  async exampleFunction() {
    return await this.mySoapClient.YourFunctionAsync();
  }
}

```

The injected Client is from the soap npm package. This example is using the [soap method async](https://www.npmjs.com/package/soap#clientmethodasyncargs-options---call-method-on-the-soap-service) from soap package. From here, please follow the [Client](https://www.npmjs.com/package/soap#client) use instructions on the soap repository.

### Soap Module Factory

You can also create your own factory implemeting SoapModuleOptionsFactory

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SoapModuleOptionsFactory, SoapModuleOptionsFactoryType } from 'nestjs-soap';

@Injectable()
export class ExampleSoapConfigService implements SoapModuleOptionsFactory {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService
  )

  createSoapModuleOptions(): SoapModuleOptionsFactoryType {
    return {
      uri: configService.get<string>('soap.uri'),
      auth: {
        type: 'basic',
        username: configService.get<string>('soap.username'),
        password: configService.get<string>('soap.password'),
      },
    };
  }
}
```
Then, import it using `useClass` or `useExisting`:
```typescript
import { Module } from '@nestjs/common';
import { SoapModule, SoapModuleOptions } from 'nestjs-soap';
import { ExampleSoapConfigService } from './example-config'

@Module({
  imports: [
    SoapModule.forRootAsync(
      { 
        clientName: 'MY_SOAP_CLIENT',
        useClass: ExampleSoapConfigService        
      }
    ),
  ],
})
export class ExampleModule {}
```
Note: for the `useExisting` provider you need to import the module containing the `ExampleSoapConfigService` provider.
### SoapModuleOptions
`clientName`: The unique client name for class injection.

`uri`: The SOAP service uri.

`auth` (optional): Basic or WSSecurity authentication. Fields `type` (basic or wssecurity), `username` and `password` are required. For the WSSecurity `options` field, refer to [soap-repository](https://www.npmjs.com/package/soap#wssecurity)
 
`clientOptions` (optional): The soap client options as in [soap repository](https://www.npmjs.com/package/soap#options).

### SoapModuleAsyncOptions
`clientName`: The unique client name for class injection.

`inject`: Array of dependencies to be injected.

`useClass`: A class implementing `SoapModuleOptionsFactory`.

`useExisting`: An injectable class implementing `SoapModuleOptionsFactory`.

`useFactory`: A factory function returning a [SoapModuleOptions](#SoapModuleOptions) object.

`imports`: Array of modules containing the injected dependencies.

`scope`: Injection scope of the injected provider.
