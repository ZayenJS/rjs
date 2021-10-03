import { NextAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';
export declare class NextApp extends AppConfig {
    private readonly name;
    constructor(name: string, options: NextAppOptions);
    generate: () => Promise<void>;
}
