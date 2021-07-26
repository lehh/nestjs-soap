"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SoapModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoapModule = void 0;
const common_1 = require("@nestjs/common");
const soap_providers_1 = require("./soap-providers");
const soap_constants_1 = require("./soap-constants");
let SoapModule = SoapModule_1 = class SoapModule {
    static registerAsync(soapOptions) {
        return this.forRoot(soapOptions);
    }
    static forRoot(soapOptions) {
        const providers = soap_providers_1.createProviders(soapOptions);
        return {
            module: SoapModule_1,
            providers,
            exports: providers,
        };
    }
    static forRootAsync(soapOptions) {
        const providers = SoapModule_1.createAsyncProviders(soapOptions);
        return {
            module: SoapModule_1,
            exports: providers,
            providers,
        };
    }
};
SoapModule.createAsyncProviders = (soapOptions) => {
    return [
        ...soap_providers_1.createAsyncProviders(soapOptions),
        {
            provide: soap_constants_1.SOAP_MODULE_INITIALIZATION,
            useFactory: (options) => options,
            inject: [
                soap_constants_1.SOAP_MODULE_OPTIONS
            ]
        },
    ];
};
SoapModule = SoapModule_1 = __decorate([
    common_1.Module({})
], SoapModule);
exports.SoapModule = SoapModule;
