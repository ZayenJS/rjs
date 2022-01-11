"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor() {
        this.exit = (...errors) => {
            console.error((0, chalk_1.default) `[{red EXIT}]:`, ...errors);
            process.exit(1);
        };
        this.error = (...errors) => console.error((0, chalk_1.default) `[{red ERROR}]:`, ...errors);
        this.debug = (...messages) => console.log((0, chalk_1.default) `[{cyan DEBUG}]:`, ...messages);
        this.log = (color, message) => console.log((0, chalk_1.default) `{${color} ${message}}`);
        this.italic = (color, message) => console.log(chalk_1.default.italic `{${color} ${message}}`);
    }
}
exports.default = new Logger();
//# sourceMappingURL=index.js.map