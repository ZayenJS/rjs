"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../Logger"));
class Container {
    constructor() {
        this.generate = () => {
            Logger_1.default.debug('container generate');
        };
    }
}
exports.default = new Container();
//# sourceMappingURL=index.js.map