import { ComponentOptions } from '../../@types';
export declare class CodeFile {
    private name;
    private options;
    constructor(name: string, options: ComponentOptions);
    generate: () => Promise<boolean>;
    private addLine;
    private getData;
    private getHeaderImports;
    private getStylingImports;
    private getComponentBody;
    private getClassComponent;
    private getFunctionComponent;
    private getClassName;
}
