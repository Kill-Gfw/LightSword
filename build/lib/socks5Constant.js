//-----------------------------------
// Copyright(c) 2015 Neko
//-----------------------------------
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
(function (AUTHENTICATION) {
    AUTHENTICATION[AUTHENTICATION["NOAUTH"] = 0] = "NOAUTH";
    AUTHENTICATION[AUTHENTICATION["GSSAPI"] = 1] = "GSSAPI";
    AUTHENTICATION[AUTHENTICATION["USERPASS"] = 2] = "USERPASS";
    AUTHENTICATION[AUTHENTICATION["NONE"] = 255] = "NONE";
})(exports.AUTHENTICATION || (exports.AUTHENTICATION = {}));
var AUTHENTICATION = exports.AUTHENTICATION;
(function (REQUEST_CMD) {
    REQUEST_CMD[REQUEST_CMD["CONNECT"] = 1] = "CONNECT";
    REQUEST_CMD[REQUEST_CMD["BIND"] = 2] = "BIND";
    REQUEST_CMD[REQUEST_CMD["UDP_ASSOCIATE"] = 3] = "UDP_ASSOCIATE";
})(exports.REQUEST_CMD || (exports.REQUEST_CMD = {}));
var REQUEST_CMD = exports.REQUEST_CMD;
(function (ATYP) {
    ATYP[ATYP["IPV4"] = 1] = "IPV4";
    ATYP[ATYP["DN"] = 3] = "DN";
    ATYP[ATYP["IPV6"] = 4] = "IPV6";
})(exports.ATYP || (exports.ATYP = {}));
var ATYP = exports.ATYP;
(function (REPLY_CODE) {
    REPLY_CODE[REPLY_CODE["SUCCESS"] = 0] = "SUCCESS";
    REPLY_CODE[REPLY_CODE["SOCKS_SERVER_FAILURE"] = 1] = "SOCKS_SERVER_FAILURE";
    REPLY_CODE[REPLY_CODE["CONNECTION_NOT_ALLOWED"] = 2] = "CONNECTION_NOT_ALLOWED";
    REPLY_CODE[REPLY_CODE["NETWORK_UNREACHABLE"] = 3] = "NETWORK_UNREACHABLE";
    REPLY_CODE[REPLY_CODE["HOST_UNREACHABLE"] = 4] = "HOST_UNREACHABLE";
    REPLY_CODE[REPLY_CODE["CONNECTION_REFUSED"] = 5] = "CONNECTION_REFUSED";
    REPLY_CODE[REPLY_CODE["TTL_EXPIRED"] = 6] = "TTL_EXPIRED";
    REPLY_CODE[REPLY_CODE["CMD_NOT_SUPPORTED"] = 7] = "CMD_NOT_SUPPORTED";
    REPLY_CODE[REPLY_CODE["ADDR_TYPE_NOT_SUPPORTED"] = 8] = "ADDR_TYPE_NOT_SUPPORTED";
})(exports.REPLY_CODE || (exports.REPLY_CODE = {}));
var REPLY_CODE = exports.REPLY_CODE;
(function (SOCKS_VER) {
    SOCKS_VER[SOCKS_VER["V5"] = 5] = "V5";
})(exports.SOCKS_VER || (exports.SOCKS_VER = {}));
var SOCKS_VER = exports.SOCKS_VER;
