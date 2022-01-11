"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFile = void 0;
class BaseFile {
    constructor(name, options) {
        this.name = name;
        this.options = options;
        this._nameWithExtension = '';
        this.getFileName = () => this._nameWithExtension;
        this.addLine = (tabs = 0, str = null) => {
            if (str === null) {
                return null;
            }
            return str ? '\t'.repeat(tabs) + str : '';
        };
    }
}
exports.BaseFile = BaseFile;
//# sourceMappingURL=BaseFile.js.map