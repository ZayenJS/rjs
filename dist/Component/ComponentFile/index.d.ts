import { BaseFile } from '../BaseFile/BaseFile';
import { ComponentOptions } from '../../@types';
export declare class ComponentFile extends BaseFile<ComponentOptions> {
    generate: () => Promise<boolean>;
    protected getData: (name?: string) => string;
    private getHeaderImports;
    private getStylingImports;
    private getComponentBody;
    private getClassComponent;
    private getFunctionComponent;
    private getClassName;
}
