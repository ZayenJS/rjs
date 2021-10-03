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
exports.ConfigFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const find_up_1 = __importDefault(require("find-up"));
const Shell_1 = __importDefault(require("../Shell"));
const FileUtil_1 = __importDefault(require("../FileUtil"));
const Logger_1 = __importDefault(require("../Logger"));
const constants_1 = require("../constants");
class ConfigFile {
    constructor(rootDirPath) {
        this.rootDirPath = rootDirPath;
        this.destinationPath = '';
        this.defaultOptions = {
            type: 'react',
            importReact: false,
            typescript: false,
            styling: 'css',
            cssModules: false,
            componentType: 'function',
            componentDir: 'src/components',
            containerDir: 'src/containers',
            pageDir: 'src/pages',
            packageManager: 'npm',
        };
        this.OVERWRITE_PROMPT = 'File already exists, do you want to overwrite it?';
        this.OVERWRITE_FAIL = 'Config file not overwritten.';
        this.SUCCESS_MESSAGE = 'Config file successfully created!';
        this.ERROR_MESSAGE = "Could not find a package.json... Make sure you're in the right directory.";
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            options = yield Shell_1.default.parseOptions(options, true);
            if (this.rootDirPath) {
                this.destinationPath = `${this.rootDirPath}${constants_1.RC_FILE_NAME}`;
                yield this.createRcTemplate(options);
                return;
            }
            const packageJsonAbsolutePath = yield find_up_1.default('package.json');
            this.rootDirPath = packageJsonAbsolutePath === null || packageJsonAbsolutePath === void 0 ? void 0 : packageJsonAbsolutePath.split('package.json')[0];
            this.destinationPath = `${this.rootDirPath}${constants_1.RC_FILE_NAME}`;
            if (!packageJsonAbsolutePath)
                Logger_1.default.exit(this.ERROR_MESSAGE);
            yield this.createRcTemplate(options);
        });
        this.createRcTemplate = (options) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileExists = yield FileUtil_1.default.fileExist(this.destinationPath);
                if (fileExists) {
                    const { overwrite } = yield Shell_1.default.alreadyExistPromp(this.OVERWRITE_PROMPT);
                    if (overwrite) {
                        promises_1.default.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
                        return Logger_1.default.log('green', this.SUCCESS_MESSAGE);
                    }
                    Logger_1.default.exit(this.OVERWRITE_FAIL);
                }
            }
            catch (error) {
                if (error.code === 'ENOENT')
                    yield promises_1.default.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
            }
            promises_1.default.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
            Logger_1.default.log('green', this.SUCCESS_MESSAGE);
        });
        this.readFile = (filePath) => __awaiter(this, void 0, void 0, function* () { return promises_1.default.readFile(filePath, { encoding: 'utf-8' }); });
        this.getConfig = (init = false) => __awaiter(this, void 0, void 0, function* () {
            if (init)
                return this.defaultOptions;
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
        this.findRcFile = () => __awaiter(this, void 0, void 0, function* () { return find_up_1.default(constants_1.RC_FILE_NAME); });
    }
}
exports.ConfigFile = ConfigFile;
exports.default = new ConfigFile();
//# sourceMappingURL=index.js.map