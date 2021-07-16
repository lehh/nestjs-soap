"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SoapCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoapCoreModule = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const soap_constants_1 = require("./soap-constants");
let SoapCoreModule = SoapCoreModule_1 = class SoapCoreModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    static forRootAsync(providers) {
        const resolvedProviders = SoapCoreModule_1.soapModuleConfig;
        console.log({ resolvedProviders });
        return {
            module: SoapCoreModule_1,
            exports: providers,
            providers,
        };
    }
    onModuleInit() {
        SoapCoreModule_1.soapModuleConfig = this.moduleRef.get(soap_constants_1.SOAP_MODULE_OPTIONS);
    }
};
SoapCoreModule = SoapCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({}),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], SoapCoreModule);
exports.SoapCoreModule = SoapCoreModule;
