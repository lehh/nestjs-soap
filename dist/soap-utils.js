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
exports.createSoapClients = exports.createSoapClient = void 0;
const common_1 = require("@nestjs/common");
const soap_1 = require("soap");
function createSoapClient(option) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield ((_a = soap_1.createClientAsync(option.uri, option.clientOptions)) === null || _a === void 0 ? void 0 : _a.catch(err => {
            throw new common_1.ServiceUnavailableException(err);
        }));
        if (option.auth) {
            const basicAuth = new soap_1.BasicAuthSecurity(option.auth.username, option.auth.password);
            client.setSecurity(basicAuth);
        }
        return client;
    });
}
exports.createSoapClient = createSoapClient;
function createSoapClients(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const asyncClients = options.map(createSoapClient);
        return Promise.all(asyncClients);
    });
}
exports.createSoapClients = createSoapClients;
