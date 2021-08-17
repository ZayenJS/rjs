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
exports.StyleFile = void 0;
const path_1 = __importDefault(require("path"));
const FileUtil_1 = __importDefault(require("../../FileUtil"));
const Shell_1 = __importDefault(require("../../Shell"));
class StyleFile {
    constructor(name, options) {
        this.name = name;
        this.options = options;
        this.generate = () => __awaiter(this, void 0, void 0, function* () {
            let styleFile = null;
            let styleFileName = null;
            if (this.options.styling !== 'none') {
                styleFileName = `${this.name}`;
                if (this.options.cssModules)
                    styleFileName += '.module';
                styleFile = yield FileUtil_1.default.createFile(path_1.default.join(this.options.componentDir, this.name), `${styleFileName}.${this.options.styling}`);
            }
            let response = true;
            if (styleFile && styleFileName) {
                const { overwrite } = yield Shell_1.default.alreadyExistPromp(`The style file ${styleFileName}.${this.options.styling} already exists, do you want to overwrite it?`);
                response = overwrite;
            }
            if (response && styleFileName) {
                yield FileUtil_1.default.writeToFile(path_1.default.join(this.options.componentDir, this.name, `${styleFileName}.${this.options.styling}`), '@import "";');
            }
            return response;
        });
    }
}
exports.StyleFile = StyleFile;
//# sourceMappingURL=index.js.map