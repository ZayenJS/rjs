import { BaseFile } from '../BaseFile/BaseFile';
import { ComponentOptions } from '../../@types';
export declare class ComponentFile extends BaseFile<ComponentOptions> {
    private props;
    getName: () => string;
    getOptions: () => ComponentOptions;
    private gatherOptionsInteractively;
    private addProps;
    private displayPropTypes;
    private displayCurrentProps;
    generate: () => Promise<boolean>;
    protected parse: (collection: unknown[]) => string;
    protected getData: (name?: string) => string;
    private getHeaderImports;
    private getStylingImports;
    private getComponentBody;
    private getClassComponent;
    private getFunctionComponent;
    private getClassName;
}
