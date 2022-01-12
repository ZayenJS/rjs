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
const ComponentFile_1 = require("./ComponentFile");
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
            hooksDir: 'src/hooks',
            tag: 'div',
            flat: false,
        };
        this.getName = () => this.name;
        this.getDefaultOptions = () => this.options;
        this.generate = (componentName, options) => __awaiter(this, void 0, void 0, function* () {
            options = yield Shell_1.default.parseOptions(options);
            const componentFile = new ComponentFile_1.ComponentFile(componentName, options);
            const generatedComponentFile = yield componentFile.generate();
            if (generatedComponentFile)
                Logger_1.default.italic('green', `Component file created successfully! (${componentFile.getFileName()})`);
            if ((0, utils_1.hasStyles)(options)) {
                options = componentFile.getOptions();
                const styleFile = new StyleFile_1.StyleFile(componentName !== null && componentName !== void 0 ? componentName : componentFile.getName(), options);
                const generatedStyleFile = yield styleFile.generate();
                if (generatedStyleFile)
                    Logger_1.default.italic('green', `Style file created successfully! (${styleFile.getFileName()})`);
            }
        });
    }
}
exports.default = new Component();
//# sourceMappingURL=index.js.map