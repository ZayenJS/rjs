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
const promises_1 = __importDefault(require("fs/promises"));
const enquirer_1 = require("enquirer");
const chalk_1 = __importDefault(require("chalk"));
const Logger_1 = __importDefault(require("../Logger"));
class FileUtil {
    constructor() {
        this.createFile = (directoryPath, fileName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join(directoryPath, fileName);
                return yield promises_1.default.open(filePath, 'w+');
            }
            catch (error) {
                const { create } = yield this.createPathPromp(directoryPath);
                if (create) {
                    yield this.createDirecoryRecursively(directoryPath);
                    Logger_1.default.log('green', `${directoryPath} created successfully!`);
                    return this.createFile(directoryPath, fileName);
                }
                Logger_1.default.exit('Path not created.');
            }
        });
        this.writeToFile = (file, data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield file.writeFile(data, { encoding: 'utf-8' });
            }
            catch (error) {
                Logger_1.default.exit(error);
            }
        });
        this.createPathPromp = (path) => __awaiter(this, void 0, void 0, function* () {
            return enquirer_1.prompt({
                type: 'toggle',
                name: 'create',
                message: chalk_1.default `{yellow Path ${path} doesn't exist, do you want to create it?}`,
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