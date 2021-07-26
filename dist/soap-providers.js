"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncProviders = exports.createProviders = void 0;
const soap_constants_1 = require("./soap-constants");
const soap_utils_1 = require("./soap-utils");
exports.createProviders = (options) => {
    return options.map(option => ({
        provide: option.connectionName,
        useFactory: () => __awaiter(void 0, void 0, void 0, function* () { return soap_utils_1.createSoapClient(option); }),
    }));
};
exports.createAsyncProviders = (options) => {
    if (options.useClass) {
        return createOptionsProviderClass(options);
    }
    return createOptionsProviderFactory(options);
};
const createOptionsProviderClass = (options) => {
    const useClass = options.useClass;
    return [
        getSoapClientConnectionProvider(options),
        createAsyncOptionsProvider(options),
        {
            provide: useClass,
            useClass,
        },
    ];
};
const createOptionsProviderFactory = (options) => {
    return [
        getSoapClientConnectionProvider(options),
        createAsyncOptionsProvider(options),
    ];
};
const getSoapClientConnectionProvider = (options) => {
    return {
        provide: options.connectionName,
        useFactory: (options) => __awaiter(void 0, void 0, void 0, function* () { return soap_utils_1.createSoapClient(options); }),
        inject: [
            soap_constants_1.SOAP_MODULE_OPTIONS
        ]
    };
};
const createAsyncOptionsProvider = (options) => {
    if (options.useFactory) {
        return getSoapModuleFactoryOptions(options);
    }
    return getSoapModuleClassOptions(options);
};
const getSoapModuleFactoryOptions = (options) => {
    return {
        inject: options.inject || [],
        provide: soap_constants_1.SOAP_MODULE_OPTIONS,
        useFactory: options.useFactory,
    };
};
const getSoapModuleClassOptions = (options) => {
    return {
        provide: soap_constants_1.SOAP_MODULE_OPTIONS,
        useFactory: (optionsFactory) => __awaiter(void 0, void 0, void 0, function* () { return optionsFactory.createSoapModuleOptions(); }),
        inject: getDependencies(options),
    };
};
const getDependencies = (options) => {
    return [(options.useClass || options.useExisting)];
};
