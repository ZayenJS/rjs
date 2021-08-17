"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const enquirer_1 = require("enquirer");
const chalk_1 = __importDefault(require("chalk"));
const Logger_1 = __importDefault(require("../Logger"));
const find_up_1 = __importStar(require("find-up"));
class FileUtil {
    constructor() {
        this.createFile = (directoryPath, fileName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join(directoryPath, fileName);
                const dirExists = yield this.checkDirectoryExistence(directoryPath);
                if (!dirExists) {
                    yield this.createDirecoryRecursively(directoryPath);
                    Logger_1.default.italic('green', `Directory ${directoryPath} created successfully!`);
                }
                const file = yield promises_1.default.open(filePath, fs_1.constants.O_CREAT);
                yield file.close();
                return promises_1.default.readFile(filePath, { encoding: 'utf8' });
            }
            catch (error) {
                Logger_1.default.debug(error);
                Logger_1.default.exit('Path not created.');
            }
        });
        this.checkDirectoryExistence = (directoryPath) => __awaiter(this, void 0, void 0, function* () {
            const packageJsonDirPath = yield find_up_1.default('package.json');
            let rootDirPath = '';
            if (!packageJsonDirPath)
                return Logger_1.default.exit('Package.json not found... Make sure you are in the right directory.');
            rootDirPath = packageJsonDirPath.split('package.json')[0];
            return find_up_1.exists(path_1.default.join(rootDirPath, directoryPath));
        });
        this.writeToFile = (path, data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.writeFile(path, data, { encoding: 'utf-8' });
            }
            catch (error) {
                Logger_1.default.exit(error);
            }
        });
        this.createPathPromp = (path, message) => __awaiter(this, void 0, void 0, function* () {
            return enquirer_1.prompt({
                type: 'toggle',
                name: 'create',
                message: chalk_1.default `{yellow ${message}}`,
                required: true,
            });
        });
        this.createDirecoryRecursively = (path) => __awaiter(this, void 0, void 0, function* () {
            yield promises_1.default.mkdir(path, { recursive: true });
        });
        this.fileExist = (path) => __awaiter(this, void 0, void 0, function* () {
            try {
                return !!(yield promises_1.default.readFile(path, { encoding: 'utf-8' }));
            }
            catch (_a) {
                return false;
            }
        });
    }
}
exports.default = new FileUtil();
//# sourceMappingURL=index.js.map