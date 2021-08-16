import { ComponentOptions } from '../@types';
declare class Component {
    private name;
    private options;
    generate: (componentName: string, options: ComponentOptions) => Promise<void>;
    private addLine;
    getData: () => string;
}
declare const _default: Component;
export default _default;
