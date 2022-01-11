import { BaseFile } from '../../Component/BaseFile/BaseFile';
import { HookOptions } from '../../@types';
export declare class HookFile extends BaseFile<HookOptions> {
    generate: () => Promise<boolean>;
    protected getData: () => string;
    private addImports;
    private addFunctionBody;
}
