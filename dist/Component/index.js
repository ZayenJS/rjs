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
const Shell_1 = __importDefault(require("../Shell"));
const Logger_1 = __importDefault(require("../Logger"));
const FileUtil_1 = __importDefault(require("../FileUtil"));
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
        this.generate = (componentName, options) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.name = componentName;
            options = yield Shell_1.default.parseOptions(options);
            this.options = Object.assign(Object.assign({}, options), { tag: (_a = options.tag) !== null && _a !== void 0 ? _a : 'div' });
            const codeFile = yield FileUtil_1.default.createFile(path_1.default.join(options.componentDir, componentName), `${componentName}.${options.typescript ? 'tsx' : 'js'}`);
            let styleFile = null;
            if (options.styling !== 'none') {
                let styleFileName = `${componentName}`;
                if (options.cssModules)
                    styleFileName += '.module';
                styleFile = yield FileUtil_1.default.createFile(path_1.default.join(options.componentDir, componentName), `${styleFileName}.${options.styling}`);
            }
            if (utils_1.isFileHandle(codeFile)) {
                Logger_1.default.debug(codeFile);
                yield FileUtil_1.default.writeToFile(codeFile, this.getData());
                yield codeFile.close();
            }
            if (utils_1.isFileHandle(styleFile))
                Logger_1.default.debug(styleFile);
            Logger_1.default.debug('generate component');
        });
        this.addLine = (tabs = 0, str = null) => {
            if (str === null) {
                return null;
            }
            return str ? '\t'.repeat(tabs) + str : '';
        };
        this.getData = () => {
            return [
                ...this.getHeaderImports(),
                ...this.getStylingImports(),
                ...this.getComponentBody(),
                this.addLine(0, `export default ${this.name};`),
            ]
                .filter((line) => typeof line === 'string')
                .join('\n');
        };
        this.getHeaderImports = () => {
            const { componentType, importReact, typescript } = this.options;
            let headerImport = null;
            if (importReact && typescript) {
                headerImport = `import React, { FC } from 'react';`;
            }
            else if (importReact && !typescript) {
                headerImport = "import React from 'react';";
            }
            else if (!importReact && typescript) {
                headerImport = "import { FC } from 'react';";
            }
            if (componentType === 'class') {
                headerImport = importReact
                    ? `import React, { Component } from 'react';`
                    : `import { Component } from 'react';`;
            }
            return [
                this.addLine(0, headerImport),
                this.addLine(0, importReact || typescript || componentType === 'class' ? '' : null),
            ];
        };
        this.getStylingImports = () => {
            const { cssModules, styling } = this.options;
            return [
                this.addLine(0, ['css', 'scss'].includes(styling) && !cssModules
                    ? `import './${this.name}.${styling}';`
                    : null),
                this.addLine(0, ['css', 'scss'].includes(styling) && cssModules
                    ? `import classes from './${this.name}.module.${styling}';`
                    : null),
                this.addLine(0, styling !== 'none' ? '' : null),
            ];
        };
        this.getComponentBody = () => {
            const { componentType, importReact, typescript, tag } = this.options;
            const component = componentType === 'function' ? this.getFunctionComponent() : this.getClassComponent();
            return [
                this.addLine(0, typescript ? `export interface ${this.name}Props {}` : null),
                this.addLine(0, importReact || typescript ? '' : null),
                this.addLine(0, typescript && componentType === 'class' ? `export interface ${this.name}State {}` : null),
                this.addLine(0, typescript && componentType === 'class' ? '' : null),
                ...component,
            ];
        };
        this.getClassComponent = () => {
            const { styling, cssModules, typescript, tag } = this.options;
            let className = '';
            if (['css', 'scss'].includes(styling)) {
                className = ` className=${cssModules ? '{classes.Container}' : `'${this.name}'`}`;
            }
            return [
                this.addLine(0, `class ${this.name} extends Component${typescript ? `<${this.name}Props, ${this.name}State>` : ''} {`),
                this.addLine(1, 'state = {};'),
                this.addLine(0, ''),
                this.addLine(1, 'render () {'),
                this.addLine(2, `return <${tag}${className}>${this.name} Class Component</${tag}>;`),
                this.addLine(1, '}'),
                this.addLine(0, '}'),
                this.addLine(0, ''),
            ];
        };
        this.getFunctionComponent = () => {
            const { typescript, tag } = this.options;
            return [
                this.addLine(0, `const ${this.name}${typescript ? `: FC<${this.name}Props>` : ''} = () => {`),
                this.addLine(1, 'return ('),
                this.addLine(2, `<${tag}>${this.name} Component</${tag}>`),
                this.addLine(1, ');'),
                this.addLine(0, '}'),
                this.addLine(0, ''),
            ];
        };
    }
}
exports.default = new Component();
//# sourceMappingURL=index.js.map