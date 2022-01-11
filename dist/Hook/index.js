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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../Logger"));
const Shell_1 = __importDefault(require("../Shell"));
const HookFile_1 = require("./HookFile");
class Hook {
    constructor() {
        this.generate = (hookName, options) => __awaiter(this, void 0, void 0, function* () {
            options = yield Shell_1.default.parseOptions(options);
            const hookFile = new HookFile_1.HookFile(hookName, options);
            if (yield hookFile.generate()) {
                Logger_1.default.log('green', `Hook file successfully generated! (${hookFile.getFileName()})`);
                return;
            }
            Logger_1.default.error(`An error occured while generating the "${hookName}" hook.`);
        });
    }
}
exports.default = new Hook();
//# sourceMappingURL=index.js.map