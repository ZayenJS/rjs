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
exports.CodeFile = void 0;
const path_1 = __importDefault(require("path"));
const FileUtil_1 = __importDefault(require("../../FileUtil"));
const Shell_1 = __importDefault(require("../../Shell"));
class CodeFile {
    constructor(name, options) {
        this.name = name;
        this.options = options;
        this.generate = () => __awaiter(this, void 0, void 0, function* () {
            const codeFileName = `${this.name}.${this.options.typescript ? 'tsx' : 'js'}`;
            const codeFile = yield FileUtil_1.default.createFile(path_1.default.join(this.options.componentDir, this.name), codeFileName);
            let response = true;
            if (codeFile) {
                const { overwrite } = yield Shell_1.default.alreadyExistPromp(`The component ${codeFileName} already exists, do you want to overwrite it?`);
                response = overwrite;
            }
            if (response) {
                yield FileUtil_1.default.writeToFile(path_1.default.join(this.options.componentDir, this.name, codeFileName), this.getData());
            }
            return response;
        });
        this.addLine = (tabs = 0, str = null) => {
            if (str === null) {
                return null;
            }
            return str ? '\t'.repeat(tabs) + str : '';
        };
        this.getData = (name = this.name) => {
            return [
                ...this.getHeaderImports(name),
                ...this.getStylingImports(name),
                ...this.getComponentBody(name),
                this.addLine(0, `export default ${name};`),
            ]
                .filter((line) => typeof line === 'string')
                .join('\n');
        };
        this.getHeaderImports = (name) => {
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
        this.getStylingImports = (name) => {
            const { cssModules, styling } = this.options;
            return [
                this.addLine(0, ['css', 'scss'].includes(styling) && !cssModules ? `import './${name}.${styling}';` : null),
                this.addLine(0, ['css', 'scss'].includes(styling) && cssModules
                    ? `import classes from './${name}.module.${styling}';`
                    : null),
                this.addLine(0, styling !== 'none' ? '' : null),
            ];
        };
        this.getComponentBody = (name) => {
            const { componentType, importReact, typescript } = this.options;
            const component = componentType === 'function' ? this.getFunctionComponent(name) : this.getClassComponent(name);
            return [
                this.addLine(0, typescript ? `export interface ${name}Props {}` : null),
                this.addLine(0, importReact || typescript ? '' : null),
                this.addLine(0, typescript && componentType === 'class' ? `export interface ${name}State {}` : null),
                this.addLine(0, typescript && componentType === 'class' ? '' : null),
                ...component,
            ];
        };
        this.getClassComponent = (name) => {
            const { typescript, tag } = this.options;
            let className = this.getClassName(name);
            return [
                this.addLine(0, `class ${name} extends Component${typescript ? `<${name}Props, ${name}State>` : ''} {`),
                this.addLine(1, 'state = {};'),
                this.addLine(0, ''),
                this.addLine(1, 'render () {'),
                this.addLine(2, `return <${tag}${className}>${name} Class Component</${tag}>;`),
                this.addLine(1, '}'),
                this.addLine(0, '}'),
                this.addLine(0, ''),
            ];
        };
        this.getFunctionComponent = (name) => {
            const { typescript, tag } = this.options;
            let className = this.getClassName(name);
            return [
                this.addLine(0, `const ${name}${typescript ? `: FC<${name}Props>` : ''} = () => {`),
                this.addLine(1, 'return ('),
                this.addLine(2, `<${tag}${className}>${name} Component</${tag}>`),
                this.addLine(1, ');'),
                this.addLine(0, '}'),
                this.addLine(0, ''),
            ];
        };
        this.getClassName = (name) => {
            const { styling, cssModules } = this.options;
            let className = '';
            if (['css', 'scss'].includes(styling)) {
                className = ` className=${cssModules ? '{classes.Container}' : `'${name}'`}`;
            }
            return className;
        };
    }
}
exports.CodeFile = CodeFile;
//# sourceMappingURL=index.js.map