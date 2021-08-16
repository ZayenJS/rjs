"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
it('Should return true if object is empty', () => {
    expect(_1.hasNoOptions({})).toBe(true);
    expect(_1.hasNoOptions({ test: 123 })).toBe(false);
});
exports.default = {};
//# sourceMappingURL=index.test.js.map