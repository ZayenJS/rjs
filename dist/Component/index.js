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
const find_up_1 = __importDefault(require("find-up"));
const ConfigFile_1 = __importDefault(require("../ConfigFile"));
const constants_1 = require("../constants");
const Logger_1 = __importDefault(require("../Logger"));
class Component {
    constructor() {
        this.name = '';
        this.generate = (componentName, options) => __awaiter(this, void 0, void 0, function* () {
            this.name = componentName;
            options = yield this.parseOptions(options);
            console.log(options);
            Logger_1.default.debug('generate component');
        });
        this.parseOptions = (cliOptions) => __awaiter(this, void 0, void 0, function* () {
            const baseOptions = yield this.getRCFileConfigData();
            for (const key in cliOptions) {
                baseOptions[key] = cliOptions[key];
            }
            return baseOptions;
        });
        this.getRCFileConfigData = () => __awaiter(this, void 0, void 0, function* () {
            const rcFilePath = yield find_up_1.default(`.${constants_1.PACKAGE_NAME}rc.json`);
            let rcFileJsonContent;
            if (rcFilePath) {
                rcFileJsonContent = yield ConfigFile_1.default.parse(rcFilePath);
                return JSON.parse(rcFileJsonContent);
            }
        });
    }
}
exports.default = new Component();
//# sourceMappingURL=index.js.map