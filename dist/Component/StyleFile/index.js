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
const BaseFile_1 = require("../BaseFile/BaseFile");
const utils_1 = require("../../utils");
class StyleFile extends BaseFile_1.BaseFile {
    constructor() {
        super(...arguments);
        this.generate = () => __awaiter(this, void 0, void 0, function* () {
            let styleFile = null;
            let styleFileName = null;
            if (this.options.styling !== 'none') {
                styleFileName = `${this.name}`;
                if (this.options.cssModules)
                    styleFileName += '.module';
                styleFile = yield FileUtil_1.default.createFile(path_1.default.join(this.options.componentDir, this.options.flat ? '' : this.name), `${styleFileName}.${this.options.styling}`);
                this._nameWithExtension = `${styleFileName}.${this.options.styling}`;
            }
            let response = true;
            if (styleFile && styleFileName) {
                const { overwrite } = yield Shell_1.default.alreadyExistPromp(`The style file ${styleFileName}.${this.options.styling} already exists, do you want to overwrite it?`);
                response = overwrite;
            }
            if (response && styleFileName) {
                yield FileUtil_1.default.writeToFile(path_1.default.join(this.options.componentDir, this.options.flat ? '' : this.name, `${styleFileName}.${this.options.styling}`), yield this.getData());
            }
            return response;
        });
        this.getData = (name = this.name) => __awaiter(this, void 0, void 0, function* () {
            const { styling, cssModules } = this.options;
            const imports = styling === 'scss'
                ? [this.addLine(0, '// @import "path_to_file";'), this.addLine(0, '')]
                : [];
            const className = cssModules ? 'Container' : (0, utils_1.toKebabCase)(name);
            return [
                ...imports,
                this.addLine(0, `.${className} {`),
                this.addLine(1, '/* your styles here... */'),
                this.addLine(0, '}'),
            ]
                .filter((line) => typeof line === 'string')
                .join('\n');
        });
    }
}
exports.StyleFile = StyleFile;
//# sourceMappingURL=index.js.map