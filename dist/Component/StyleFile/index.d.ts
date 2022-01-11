import { BaseFile } from '../BaseFile/BaseFile';
import { ComponentOptions } from '../../@types';
export declare class StyleFile extends BaseFile<ComponentOptions> {
    generate: () => Promise<boolean>;
    protected getData: (name?: string) => Promise<string>;
}
