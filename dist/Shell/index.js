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
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const enquirer_1 = require("enquirer");
const ConfigFile_1 = __importDefault(require("../ConfigFile"));
const Logger_1 = __importDefault(require("../Logger"));
class Shell {
    constructor() {
        this.parseOptions = (options, init = false) => __awaiter(this, void 0, void 0, function* () {
            const baseOptions = yield ConfigFile_1.default.getConfig(init);
            let dirPath = options.componentDir;
            for (const key in options) {
                baseOptions[key] = options[key];
            }
            if (dirPath === null || dirPath === void 0 ? void 0 : dirPath.startsWith('/')) {
                Logger_1.default.exit('Absolute paths are not supported, please use a relative one.');
            }
            else if (init && dirPath && !dirPath.includes('src') && baseOptions.type === 'react') {
                baseOptions.componentDir = `src/${dirPath}`;
            }
            if (!init && dirPath) {
                if (dirPath === null || dirPath === void 0 ? void 0 : dirPath.startsWith('./')) {
                    const cleanedDirPath = dirPath.split('./')[1];
                    dirPath = path_1.default.join(process.cwd(), cleanedDirPath);
                }
                else {
                    dirPath = path_1.default.join(process.cwd(), dirPath);
                }
                baseOptions.componentDir = dirPath;
            }
            return baseOptions;
        });
        this.alreadyExistPromp = (message) => __awaiter(this, void 0, void 0, function* () {
            return (0, enquirer_1.prompt)({
                type: 'toggle',
                name: 'overwrite',
                message: (0, chalk_1.default) `{yellow ${message}}`,
                required: true,
            });
        });
        this.togglePrompt = (name, message) => __awaiter(this, void 0, void 0, function* () {
            return (0, enquirer_1.prompt)({
                type: 'toggle',
                name,
                message,
                required: true,
            });
        });
    }
}
exports.default = new Shell();
//# sourceMappingURL=index.js.map