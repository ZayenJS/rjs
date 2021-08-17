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
const Shell_1 = __importDefault(require("../Shell"));
const Logger_1 = __importDefault(require("../Logger"));
const CodeFile_1 = require("./CodeFile");
const StyleFile_1 = require("./StyleFile");
const utils_1 = require("../utils");
class Component {
    constructor() {
        this.name = '';
        this.options = {
            importReact: false,
            typescript: false,
            styling: 'css',
            cssModules: false,
            componentType: 'function',
            componentDir: 'src/components',
            tag: 'div',
        };
        this.getName = () => this.name;
        this.getDefaultOptions = () => this.options;
        this.generate = (componentName, options) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            options = yield Shell_1.default.parseOptions(options);
            this.options = Object.assign(Object.assign({}, options), { tag: (_a = options.tag) !== null && _a !== void 0 ? _a : 'div' });
            const codeFile = new CodeFile_1.CodeFile(componentName, options);
            const generatedCodeFile = yield codeFile.generate();
            if (generatedCodeFile)
                Logger_1.default.italic('green', `Component file created successfully!`);
            if (utils_1.hasStyles(options)) {
                const styleFile = new StyleFile_1.StyleFile(componentName, options);
                const generatedStyleFile = yield styleFile.generate();
                if (generatedStyleFile)
                    Logger_1.default.italic('green', `Style file created successfully!`);
            }
        });
    }
}
exports.default = new Component();
//# sourceMappingURL=index.js.map