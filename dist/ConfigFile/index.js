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
const promises_1 = __importDefault(require("fs/promises"));
const find_up_1 = __importDefault(require("find-up"));
const Shell_1 = __importDefault(require("../Shell"));
const FileUtil_1 = __importDefault(require("../FileUtil"));
const Logger_1 = __importDefault(require("../Logger"));
const constants_1 = require("../constants");
class ConfigFile {
    constructor() {
        this.rootDirPath = '';
        this.destinationPath = '';
        this.defaultOptions = {
            type: 'react',
            importReact: false,
            typescript: true,
            styling: 'css',
            cssModules: false,
            componentType: 'function',
            componentDir: 'src/components',
            containerDir: 'src/containers',
            pageDir: 'src/pages',
            packageManager: 'npm',
        };
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            const packageJsonAbsolutePath = yield find_up_1.default('package.json');
            options = yield Shell_1.default.parseOptions(options);
            if (packageJsonAbsolutePath) {
                this.rootDirPath = packageJsonAbsolutePath === null || packageJsonAbsolutePath === void 0 ? void 0 : packageJsonAbsolutePath.split('package.json')[0];
                this.destinationPath = `${this.rootDirPath}.${constants_1.PACKAGE_NAME}rc.json`;
                return this.createRcTemplate(options);
            }
            Logger_1.default.exit("Could not find a package.json... Make sure you're in the right directory.");
        });
        this.createRcTemplate = (options) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileExists = yield FileUtil_1.default.fileExist(this.destinationPath);
                if (fileExists) {
                    const { overwrite } = yield Shell_1.default.alreadyExistPromp('File already exists, do you want to overwrite it?');
                    if (overwrite) {
                        promises_1.default.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
                        return Logger_1.default.log('green', 'Config file successfully created!');
                    }
                    Logger_1.default.exit('Config file not overwritten.');
                }
            }
            catch (error) {
                if (error.code === 'ENOENT')
                    yield promises_1.default.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
            }
        });
        this.readFile = (filePath) => __awaiter(this, void 0, void 0, function* () { return promises_1.default.readFile(filePath, { encoding: 'utf-8' }); });
        this.getConfig = () => __awaiter(this, void 0, void 0, function* () {
            let config = yield this.getConfigFileContent();
            if (!config)
                config = this.defaultOptions;
            return config;
        });
        this.getConfigFileContent = () => __awaiter(this, void 0, void 0, function* () {
            const rcFilePath = yield this.findRcFile();
            let rcFileJsonContent;
            if (rcFilePath) {
                rcFileJsonContent = yield this.readFile(rcFilePath);
                return JSON.parse(rcFileJsonContent);
            }
            return null;
        });
        this.findRcFile = () => __awaiter(this, void 0, void 0, function* () { return find_up_1.default(`.${constants_1.PACKAGE_NAME}rc.json`); });
    }
}
exports.default = new ConfigFile();
//# sourceMappingURL=index.js.map