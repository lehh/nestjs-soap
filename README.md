# Nestjs Soap

Nestjs module wrapper for soap

This package internally uses [soap](https://www.npmjs.com/package/soap) npm package

## Install

```bash
npm install nestjs-soap
```
Or, if you use yarn
```bash
yarn add nestjs-soap
```

## How to use
After installing the package, just import the SoapModule on the module you want to use the soap client.  

```javascript
import { Module } from '@nestjs/common';
import { SoapModule } from 'nestjs-soap';

@Module({
  imports: [
    SoapModule.registerAsync([
      { name: 'MY_SOAP_CLIENT', uri: 'http://yourserver/yourservice.wso?wsdl' },
    ]),
  ],
})
export class ExampleModule {}
```
The `registerAsync` function receives an array of [SoapModuleOptions](#SoapModuleOptions). This means you can create as many clients you need. You just need to create unique names for each one.


Another way to import the SoapModule is using `forRootAsync`, Like other [factory provider](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory), our factory function can be `async` and can inject dependencies through `inject`:


```javascript
import { Module } from '@nestjs/common';
import { SoapModule, SoapModuleOptions } from 'nestjs-soap';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SoapModule.forRootAsync([
      { 
        name: 'MY_SOAP_CLIENT',
        inject: [ConfigService],
        useFactory: async (
          configService: ConfigService,
        ): Promise<SoapModuleOptions> => ({
          uri: configService.get<string>('soap.uri'),
          auth: {
            username: configService.get<string>('soap.username'),
            password: configService.get<string>('soap.password'),
          },
        }),        
      }
    ]),
  ],
})
export class ExampleModule {}
```


Then inject the client where you want to use it.
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

The injected Client is from the soap npm package. From here, please follow the use instructions on the [soap repository](https://www.npmjs.com/package/soap).


### SoapModuleOptions
`name`: The unique client name for class injection.

`uri`: The SOAP service uri.

`auth`: Option Basic authentication is enabled if you will fill in the `username` and `password`.
 
`clientOptions`: The soap client options as in [soap repository](https://www.npmjs.com/package/soap#options) .
