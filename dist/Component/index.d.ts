import { ComponentOptions } from '../@types';
declare class Component {
    private name;
    private options;
    getName: () => string;
    getDefaultOptions: () => ComponentOptions;
    generate: (componentName: string, options: ComponentOptions) => Promise<void>;
}
declare const _default: Component;
export default _default;
