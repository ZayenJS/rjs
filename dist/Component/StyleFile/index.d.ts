import { BaseFile } from '../BaseFile/BaseFile';
export declare class StyleFile extends BaseFile {
    generate: () => Promise<boolean>;
    protected getData: (name?: string) => Promise<string>;
}
