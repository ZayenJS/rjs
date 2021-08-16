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
const fs_1 = require("fs");
const promises_1 = __importDefault(require("fs/promises"));
const enquirer_1 = require("enquirer");
const find_up_1 = __importDefault(require("find-up"));
const chalk_1 = __importDefault(require("chalk"));
const Logger_1 = __importDefault(require("../Logger"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
class ConfigFile {
    constructor() {
        this.rootDirPath = '';
        this.destinationPath = '';
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            const packageJsonAbsolutePath = yield find_up_1.default('package.json');
            if (packageJsonAbsolutePath) {
                this.rootDirPath = packageJsonAbsolutePath === null || packageJsonAbsolutePath === void 0 ? void 0 : packageJsonAbsolutePath.split('package.json')[0];
                this.destinationPath = `${this.rootDirPath}.${constants_1.PACKAGE_NAME}rc.json`;
                if (utils_1.hasNoOptions(options)) {
                    return this.copyRcTemplate();
                }
                return this.createRcTemplate(options);
            }
            Logger_1.default.exit("Could not find a package.json... Make sure you're in the right directory.");
        });
        this.copyRcTemplate = () => __awaiter(this, void 0, void 0, function* () {
            const rcTemplatePath = path_1.default.join(this.rootDirPath, 'rc-template.json');
            try {
                yield promises_1.default.copyFile(rcTemplatePath, this.destinationPath, fs_1.constants.COPYFILE_EXCL);
                Logger_1.default.log('green', 'Config file successfully created!');
            }
            catch (error) {
                if (error.code === 'EEXIST') {
                    const { overwrite } = yield this.prompForOverwrite();
                    console.log(overwrite);
                    if (overwrite) {
                        yield promises_1.default.copyFile(rcTemplatePath, this.destinationPath);
                        return Logger_1.default.log('green', 'Config file successfully created!');
                    }
                    Logger_1.default.exit('Config file not overwritten.');
                }
                Logger_1.default.error(`An unexpected error occured while creating the .${constants_1.PACKAGE_NAME}rc.json file.`);
                Logger_1.default.exit(error);
            }
        });
        this.createRcTemplate = (options) => __awaiter(this, void 0, void 0, function* () {
            const rcTemplatePath = path_1.default.join(this.rootDirPath, 'rc-template.json');
            const rcTemplateJSONFile = yield this.parse(rcTemplatePath);
            const rcTemplate = JSON.parse(rcTemplateJSONFile);
            for (const key in options) {
                rcTemplate[key] = options[key];
            }
            try {
                const file = yield promises_1.default.readFile(this.destinationPath, { encoding: 'utf-8' });
                if (file) {
                    const { overwrite } = yield this.prompForOverwrite();
                    if (overwrite) {
                        promises_1.default.writeFile(this.destinationPath, JSON.stringify(rcTemplate, null, 2));
                        return Logger_1.default.log('green', 'Config file successfully created!');
                    }
                    Logger_1.default.exit('Config file not overwritten.');
                }
            }
            catch (error) {
                if (error.code === 'ENOENT')
                    yield promises_1.default.writeFile(this.destinationPath, JSON.stringify(rcTemplate, null, 2));
            }
        });
        this.prompForOverwrite = () => __awaiter(this, void 0, void 0, function* () {
            return enquirer_1.prompt({
                type: 'toggle',
                name: 'overwrite',
                message: chalk_1.default `{yellow File already exists, do you want to overwrite it?}`,
                required: true,
            });
        });
        this.parse = (filePath) => __awaiter(this, void 0, void 0, function* () { return promises_1.default.readFile(filePath, { encoding: 'utf-8' }); });
    }
}
exports.default = new ConfigFile();
//# sourceMappingURL=index.js.map