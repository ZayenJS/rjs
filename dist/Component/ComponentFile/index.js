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
exports.ComponentFile = void 0;
const path_1 = __importDefault(require("path"));
const FileUtil_1 = __importDefault(require("../../FileUtil"));
const Shell_1 = __importDefault(require("../../Shell"));
const Logger_1 = __importDefault(require("../../Logger"));
const utils_1 = require("../../utils");
const BaseFile_1 = require("../BaseFile/BaseFile");
const enquirer_1 = require("enquirer");
class ComponentFile extends BaseFile_1.BaseFile {
    constructor() {
        super(...arguments);
        this.props = {};
        this.getName = () => this.name;
        this.getOptions = () => this.options;
        this.gatherOptionsInteractively = () => __awaiter(this, void 0, void 0, function* () {
            const { name } = yield (0, enquirer_1.prompt)({
                type: 'input',
                name: 'name',
                message: "What is the component's name?",
                format: (value) => value
                    ? value
                        .split(/\W/gim)
                        .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
                        .join('')
                    : '',
                result: (value) => value
                    .split(/\W/gim)
                    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
                    .join(''),
                required: true,
            });
            const { importReact } = yield Shell_1.default.togglePrompt('importReact', 'Do you want to import React from react ?');
            this.options.importReact = importReact;
            const { typescript } = yield Shell_1.default.togglePrompt('typescript', 'Do you want to use typescript?');
            const { styling } = yield (0, enquirer_1.prompt)({
                type: 'select',
                name: 'styling',
                message: 'Which styling option do you want? (pick one)',
                choices: ['css', 'scss', 'none'],
            });
            if (styling !== 'none') {
                const { cssModules } = yield (0, enquirer_1.prompt)({
                    type: 'toggle',
                    name: 'cssModules',
                    message: 'Do you want to use css modules?',
                    required: true,
                });
                this.options.cssModules = cssModules;
            }
            const { componentType } = yield (0, enquirer_1.prompt)({
                type: 'select',
                name: 'componentType',
                message: 'What type of components do you use?',
                choices: ['function', 'class'],
            });
            const { componentDir } = yield (0, enquirer_1.prompt)({
                type: 'input',
                name: 'componentDir',
                initial: 'src/components',
                format: (value) => `./${value}`,
                result: (value) => path_1.default.join(process.cwd(), value),
                message: "Component's folder path? (will be appended to the current path)",
            });
            const { tag } = yield (0, enquirer_1.prompt)({
                type: 'input',
                name: 'tag',
                initial: 'div',
                message: 'What tag do you want to use?',
            });
            const { flat } = yield (0, enquirer_1.prompt)({
                type: 'toggle',
                name: 'flat',
                message: 'Do you want to generate the files inside a folder?',
            });
            this.name = name;
            this.options = Object.assign(Object.assign({}, this.options), { componentDir,
                componentType,
                importReact,
                styling,
                typescript,
                tag, flat: !flat });
            const { props } = yield (0, enquirer_1.prompt)({
                type: 'toggle',
                name: 'props',
                message: 'Do you want to add props?',
            });
            if (props)
                yield this.addProps();
        });
        this.addProps = () => __awaiter(this, void 0, void 0, function* () {
            while (true) {
                const { propName } = yield (0, enquirer_1.prompt)({
                    type: 'input',
                    name: 'propName',
                    message: 'Enter the prop name (press enter if you are done): ',
                });
                if (!propName)
                    break;
                let propType = null;
                if (this.options.typescript) {
                    const response = yield (0, enquirer_1.prompt)({
                        type: 'input',
                        name: 'propType',
                        message: 'Enter the prop type (? to see all available types): ',
                        required: true,
                    });
                    propType = response.propType;
                    while (propType === '?') {
                        this.displayPropTypes();
                        const response = yield (0, enquirer_1.prompt)({
                            type: 'input',
                            name: 'propType',
                            message: 'Enter the prop type (? to see all available types): ',
                            required: true,
                        });
                        propType = response.propType;
                    }
                }
                if (propType === 'function')
                    propType = '() => void';
                else if ((propType === null || propType === void 0 ? void 0 : propType.toLowerCase()) === 'array') {
                    const response = yield (0, enquirer_1.prompt)({
                        type: 'input',
                        name: 'arrayType',
                        message: 'Enter the array type (? to see all available types): ',
                        required: true,
                    });
                    propType = `${response.arrayType}[]`;
                }
                this.props[propName] = propType;
            }
        });
        this.displayPropTypes = () => {
            Logger_1.default.log('yellow', '\tAVAILABLE TYPES');
            Logger_1.default.log('yellow', '___________________________________');
            Logger_1.default.log('white', 'string');
            Logger_1.default.log('white', 'number');
            Logger_1.default.log('white', 'boolean');
            Logger_1.default.log('white', 'array');
            Logger_1.default.log('white', 'function');
        };
        this.generate = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.name)
                yield this.gatherOptionsInteractively();
            const componentFileName = `${this.name}.${this.options.typescript ? 'tsx' : 'js'}`;
            this._nameWithExtension = componentFileName;
            const dirPath = this.options.componentDir;
            const componentFile = yield FileUtil_1.default.createFile(path_1.default.join(dirPath, this.options.flat ? '' : this.name), componentFileName);
            let response = true;
            if (componentFile) {
                const { overwrite } = yield Shell_1.default.alreadyExistPromp(`The component ${componentFileName} already exists, do you want to overwrite it?`);
                response = overwrite;
            }
            if (response) {
                yield FileUtil_1.default.writeToFile(path_1.default.join(dirPath, this.options.flat ? '' : this.name, componentFileName), this.getData());
            }
            return response;
        });
        this.getData = (name = this.name) => [
            ...this.getHeaderImports(),
            ...this.getStylingImports(name),
            ...this.getComponentBody(name),
            this.addLine(0, `export default ${name};`),
        ]
            .filter((line) => typeof line === 'string')
            .join('\n');
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
        this.getStylingImports = (name) => {
            const { cssModules, styling } = this.options;
            return [
                this.addLine(0, (0, utils_1.hasStyles)(this.options) && !cssModules ? `import './${name}.${styling}';` : null),
                this.addLine(0, (0, utils_1.hasStyles)(this.options) && cssModules
                    ? `import classes from './${name}.module.${styling}';`
                    : null),
                this.addLine(0, styling !== 'none' ? '' : null),
            ];
        };
        this.getComponentBody = (name) => {
            var _a;
            const { componentType, importReact, typescript } = this.options;
            this.options.tag = (_a = this.options.tag) !== null && _a !== void 0 ? _a : 'div';
            const component = componentType === 'function' ? this.getFunctionComponent(name) : this.getClassComponent(name);
            let typescriptInterface = [
                this.addLine(0, typescript ? `export interface ${name}Props {}` : null),
            ];
            if (Object.keys(this.props).length && typescript) {
                typescriptInterface = [this.addLine(0, `export interface ${name}Props {`)];
                for (const entry of Object.entries(this.props)) {
                    typescriptInterface.push(this.addLine(1, `${entry[0]}: ${entry[1]};`));
                }
                typescriptInterface.push(this.addLine(0, '}'));
            }
            return [
                ...typescriptInterface,
                this.addLine(0, importReact || typescript ? '' : null),
                this.addLine(0, typescript && componentType === 'class' ? `export interface ${name}State {}` : null),
                this.addLine(0, typescript && componentType === 'class' ? '' : null),
                ...component,
            ];
        };
        this.getClassComponent = (name) => {
            const { typescript, tag } = this.options;
            const className = this.getClassName(name);
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
            const className = this.getClassName(name);
            return [
                this.addLine(0, `const ${name}${typescript ? `: FC<${name}Props>` : ''} = (${Object.keys(this.props).length ? `{${Object.keys(this.props).join(', ')}}` : ''}) => {`),
                this.addLine(1, 'return ('),
                this.addLine(2, `<${tag}${className}>${name} Component</${tag}>`),
                this.addLine(1, ');'),
                this.addLine(0, '}'),
                this.addLine(0, ''),
            ];
        };
        this.getClassName = (name) => {
            const { cssModules } = this.options;
            if ((0, utils_1.hasStyles)(this.options)) {
                return ` className=${cssModules ? '{classes.Container}' : `'${(0, utils_1.toKebabCase)(name)}'`}`;
            }
            return '';
        };
    }
}
exports.ComponentFile = ComponentFile;
//# sourceMappingURL=index.js.map