"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFileHandle = exports.hasNoOptions = void 0;
const hasNoOptions = (options) => Object.keys(options).length <= 0;
exports.hasNoOptions = hasNoOptions;
const isFileHandle = (data) => {
    try {
        return 'close' in data;
    }
    catch (_a) {
        return false;
    }
};
exports.isFileHandle = isFileHandle;
//# sourceMappingURL=index.js.map