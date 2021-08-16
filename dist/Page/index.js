"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../Logger"));
class Page {
    constructor() {
        this.generate = () => {
            Logger_1.default.debug('page generate');
        };
    }
}
exports.default = new Page();
//# sourceMappingURL=index.js.map