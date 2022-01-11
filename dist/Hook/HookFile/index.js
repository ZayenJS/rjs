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
exports.HookFile = void 0;
const path_1 = __importDefault(require("path"));
const Shell_1 = __importDefault(require("../../Shell"));
const BaseFile_1 = require("../../Component/BaseFile/BaseFile");
const FileUtil_1 = __importDefault(require("../../FileUtil"));
const Logger_1 = __importDefault(require("../../Logger"));
class HookFile extends BaseFile_1.BaseFile {
    constructor() {
        super(...arguments);
        this.generate = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.name.startsWith('use'))
                Logger_1.default.exit('Hooks must start with "use"!');
            const hookFileName = `${this.name}.${this.options.typescript ? 'ts' : 'js'}`;
            this._nameWithExtension = hookFileName;
            const dirPath = this.options.hooksDir;
            const hookFile = yield FileUtil_1.default.createFile(path_1.default.join(dirPath), hookFileName);
            let response = true;
            if (hookFile) {
                const { overwrite } = yield Shell_1.default.alreadyExistPromp(`The hook ${hookFileName} already exists, do you want to overwrite it?`);
                response = overwrite;
            }
            if (response) {
                yield FileUtil_1.default.writeToFile(path_1.default.join(dirPath, hookFileName), this.getData());
            }
            return response;
        });
        this.getData = () => [...this.addImports(), this.addLine(0, ''), ...this.addFunctionBody()]
            .filter((line) => typeof line === 'string')
            .join('\n');
        this.addImports = () => {
            const { useDispatch, useEffect, useSelector, useState } = this.options;
            let imports = `import { `;
            const hooks = [];
            if (useState)
                hooks.push('useState');
            if (useEffect)
                hooks.push('useEffect');
            if (useSelector)
                hooks.push('useSelector');
            if (useDispatch)
                hooks.push('useDispatch');
            imports += `${hooks.join(', ')} } from 'react';`;
            return hooks.length ? [this.addLine(0, imports)] : '';
        };
        this.addFunctionBody = () => {
            const { useDispatch, useEffect, useSelector, useState, typescript } = this.options;
            const state = useState ? this.addLine(1, 'const [state, setState] = useState({});') : null;
            const dispatch = useDispatch ? this.addLine(1, 'const dispatch = useDispatch();') : null;
            const effect = useEffect ? this.addLine(1, 'useEffect(() => {}, []);') : null;
            const selector = useSelector
                ? this.addLine(1, `const selector = useSelector((state) => {});${typescript ? ' // TODO: type the state parameter' : ''}`)
                : null;
            return [
                this.addLine(0, `export const ${this.name} = () => {`),
                state,
                selector,
                dispatch,
                this.addLine(0, ``),
                effect,
                this.addLine(0, ``),
                this.addLine(1, 'return {}; // TODO?: return value from hook'),
                this.addLine(0, `}`),
            ];
        };
    }
}
exports.HookFile = HookFile;
//# sourceMappingURL=index.js.map