# Upgrading to V2

## Breaking Changes
- `forRoot`, `forRootAsync`, `register` and `registerAsync` doesn't receive an array of items anymore.
 - `registerAsync` is now used to register async providers like: useFactory, useExisting or useClass.
 - Property `name` was renamed to `clientName` in `SoapModuleOptions` and `SoapModuleAsyncOptions` interfaces;
 - Defined `SoapModuleOptionsFactoryType` for `createSoapModuleOptions` and `useFactory` functions return types.

 ### So, what you need to do is basically:
 - ***Create an import for each client;***
 - ***Use `register` instead of `registerAsync`;***
 - ***Use `clientName` instead of `name`;***
 - ***Use `SoapModuleOptionsFactoryType` instead of `SoapModuleOptions` on the return type of the `createSoapModuleOptions`/`useFactory` function.***