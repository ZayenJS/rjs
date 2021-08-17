import { ComponentOptions } from '../@types';
declare class Component {
    private name;
    private options;
    generate: (componentName: string, options: ComponentOptions) => Promise<void>;
    private addLine;
    getData: () => string;
    private getHeaderImports;
    private getStylingImports;
    private getComponentBody;
    private getClassComponent;
    private getFunctionComponent;
}
declare const _default: Component;
export default _default;
