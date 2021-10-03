import { ReactAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';
export declare class ReactApp extends AppConfig {
    protected options: ReactAppOptions;
    constructor(options: ReactAppOptions);
    generate: () => Promise<void>;
    private createReactApp;
}
