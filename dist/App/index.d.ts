import { AppOptions } from '../@types';
import { AppConfig } from './AppConfig';
export declare class App extends AppConfig {
    private gatherOptionsInteractively;
    createReactApp: (name: string, options: AppOptions) => Promise<void>;
    createNextApp: (name: string, options: AppOptions) => Promise<void>;
    private parseAppOptions;
    private commit;
}
declare const _default: App;
export default _default;
