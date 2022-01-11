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
exports.App = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
const enquirer_1 = require("enquirer");
const Logger_1 = __importDefault(require("../Logger"));
const ConfigFile_1 = require("../ConfigFile");
const ReactApp_1 = require("./ReactApp");
const NextApp_1 = require("./NextApp");
const AppConfig_1 = require("./AppConfig");
const utils_1 = require("../utils");
const Shell_1 = __importDefault(require("../Shell"));
class App extends AppConfig_1.AppConfig {
    constructor() {
        super(...arguments);
        this.gatherOptionsInteractively = (type) => __awaiter(this, void 0, void 0, function* () {
            if (!this.options.name) {
                const { name } = yield (0, enquirer_1.prompt)({
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the app?',
                });
                this.options.name = name;
            }
            if (type === 'react') {
                const { importReact } = yield Shell_1.default.togglePrompt('importReact', 'Do you want to import React from react ?');
                this.options.importReact = importReact;
            }
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
                message: 'What type of components fo you use?',
                choices: ['function', 'class'],
            });
            const { componentDir } = yield (0, enquirer_1.prompt)({
                type: 'input',
                name: 'componentDir',
                message: 'Where do you want your components to be generated? (please use a relative path. e.g: src/components)',
            });
            const { router } = yield (0, enquirer_1.prompt)({
                type: 'toggle',
                name: 'router',
                message: 'Do you plan on using a router?',
                required: true,
            });
            const { redux } = yield (0, enquirer_1.prompt)({
                type: 'toggle',
                name: 'redux',
                message: 'Do you want redux as your state management option?',
                required: true,
            });
            const { axios } = yield (0, enquirer_1.prompt)({
                type: 'toggle',
                name: 'axios',
                message: 'Do you need axios?',
                required: true,
            });
            const { packageManager } = yield (0, enquirer_1.prompt)({
                type: 'select',
                name: 'componentType',
                message: 'What package manager do you want to use?',
                choices: ['npm', 'yarn'],
            });
            this.options = Object.assign(Object.assign({}, this.options), { typescript,
                styling,
                componentType,
                componentDir,
                router,
                redux,
                axios,
                packageManager });
        });
        this.createReactApp = (name, options) => __awaiter(this, void 0, void 0, function* () {
            if (!name || options.interactive) {
                yield this.gatherOptionsInteractively('react');
            }
            else {
                this.options.name = name;
                this.options = this.parseAppOptions(options);
            }
            const reactApp = new ReactApp_1.ReactApp(this.options);
            yield reactApp.generate();
            const confFile = new ConfigFile_1.ConfigFile(`${this.options.name}/`);
            yield confFile.generate(Object.assign(Object.assign({}, this.options), { type: 'react' }));
            yield this.commit();
        });
        this.createNextApp = (name, options) => __awaiter(this, void 0, void 0, function* () {
            if (!name) {
                this.gatherOptionsInteractively('next');
            }
            shelljs_1.default.exec(`npx create-react-app ${name}`);
            const confFile = new ConfigFile_1.ConfigFile(`${name}/`);
            yield confFile.generate(Object.assign(Object.assign({}, options), { type: 'next', pageDir: 'pages' }));
            const nextApp = new NextApp_1.NextApp(name, this.options);
            yield nextApp.generate();
        });
        this.parseAppOptions = (options) => {
            const opts = Object.assign({}, this.options);
            for (const [key, value] of Object.entries(options)) {
                if (value) {
                    opts[key] = value;
                }
            }
            return opts;
        };
        this.commit = () => __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.default.log('yellow', 'Creating git commit...');
                shelljs_1.default.cd(this.options.name);
                yield (0, utils_1.sleep)(2000);
                shelljs_1.default.exec('git add .');
                shelljs_1.default.exec('git commit --amend -qm "initial commit made by r8y!"');
                Logger_1.default.log('green', 'Done !');
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.App = App;
exports.default = new App();
//# sourceMappingURL=index.js.map