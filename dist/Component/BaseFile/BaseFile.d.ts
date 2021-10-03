import { ComponentOptions } from '../../@types';
export declare abstract class BaseFile {
    protected name: string;
    protected options: ComponentOptions;
    constructor(name: string, options: ComponentOptions);
    protected addLine: (tabs?: number, str?: string | null) => string | null;
    protected abstract getData: (name: string) => void;
}
