"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.toKebabCase = exports.hasStyles = void 0;
const hasStyles = (options) => ['css', 'scss'].includes(options.styling);
exports.hasStyles = hasStyles;
const toKebabCase = (str) => {
    var _a, _b;
    return str &&
        ((_b = (_a = str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)) === null || _a === void 0 ? void 0 : _a.map((x) => x.toLowerCase())) === null || _b === void 0 ? void 0 : _b.join('-'));
};
exports.toKebabCase = toKebabCase;
const sleep = (timer) => new Promise((resolve) => setTimeout(resolve, timer));
exports.sleep = sleep;
//# sourceMappingURL=index.js.map