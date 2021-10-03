"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
class AppConfig {
    constructor() {
        this.options = {
            name: '',
            interactive: false,
            router: false,
            redux: false,
            axios: false,
            importReact: false,
            typescript: false,
            styling: 'scss',
            cssModules: false,
            componentType: 'function',
            componentDir: 'src/components',
            containerDir: 'src/containers',
            pageDir: 'src/pages',
            packageManager: 'npm',
        };
    }
}
exports.AppConfig = AppConfig;
//# sourceMappingURL=AppConfig.js.map