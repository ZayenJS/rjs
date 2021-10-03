import { BaseFile } from '../BaseFile/BaseFile';
export declare class CodeFile extends BaseFile {
    generate: () => Promise<boolean>;
    protected getData: (name?: string) => string;
    private getHeaderImports;
    private getStylingImports;
    private getComponentBody;
    private getClassComponent;
    private getFunctionComponent;
    private getClassName;
}
