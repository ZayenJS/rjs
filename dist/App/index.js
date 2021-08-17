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
const Component_1 = __importDefault(require("../Component"));
class App {
    constructor() {
        this.createReactApp = () => __awaiter(this, void 0, void 0, function* () {
            const componentOptions = Component_1.default.getDefaultOptions();
            yield Component_1.default.generate('App', componentOptions);
        });
        this.createNextApp = () => { };
    }
}
exports.App = App;
App.initProject = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.default = new App();
//# sourceMappingURL=index.js.map