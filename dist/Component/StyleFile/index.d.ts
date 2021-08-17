import { ComponentOptions } from '../../@types';
export declare class StyleFile {
    private name;
    private options;
    constructor(name: string, options: ComponentOptions);
    generate: () => Promise<boolean>;
}
