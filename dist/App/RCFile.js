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
const Logger_1 = __importDefault(require("../Logger"));
const constants_1 = require("../constants");
class RCFile {
    constructor() {
        this.generate = () => __awaiter(this, void 0, void 0, function* () {
            const packageJsonAbsolutePath = yield find_up_1.default('package.json');
            const rootDirPath = packageJsonAbsolutePath === null || packageJsonAbsolutePath === void 0 ? void 0 : packageJsonAbsolutePath.split('package.json')[0];
            const destinationPath = `${rootDirPath}/${constants_1.PACKAGE_NAME}rc.json`;
            try {
                const s = yield promises_1.default.readFile(destinationPath, { flag: 'r' });
                Logger_1.default.debug(s);
            }
            catch (error) {
                if (error.code === 'EEXIST')
                    Logger_1.default.error(`The ${constants_1.PACKAGE_NAME}rc.json config file already exists in ${rootDirPath}.`);
                process.exit(1);
            }
        });
    }
}
exports.default = new RCFile();
//# sourceMappingURL=RCFile.js.map