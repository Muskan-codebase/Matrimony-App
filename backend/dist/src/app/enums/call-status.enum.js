"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallStatus = void 0;
var CallStatus;
(function (CallStatus) {
    CallStatus["RINGING"] = "ringing";
    CallStatus["ANSWERED"] = "answered";
    CallStatus["REJECTED"] = "rejected";
    CallStatus["MISSED"] = "missed";
    CallStatus["ENDED"] = "ended";
})(CallStatus || (exports.CallStatus = CallStatus = {}));
