declare class Component {
    name: string;
    generate: (componentName: string, options: any) => Promise<void>;
    private parseOptions;
    private getRCFileConfigData;
}
declare const _default: Component;
export default _default;
