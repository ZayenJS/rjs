export declare type Styling = 'scss' | 'css' | 'none';
export declare type ComponentType = 'function' | 'class';
export interface BaseOptions {
    importReact: boolean;
    typescript: boolean;
    styling: Styling;
    cssModules: boolean;
    componentType: ComponentType;
    componentDir: string;
    hooksDir: string;
    pageDir?: string;
    packageManager?: 'npm' | 'yarn';
}
export interface ConfigFileOptions extends BaseOptions {
    type: 'react' | 'next';
}
export declare type ConfigFileKeys = keyof ConfigFileOptions;
export interface ComponentOptions extends BaseOptions {
    tag: string;
    flat: boolean;
}
export interface AppOptions extends BaseOptions {
    name: string;
    interactive: boolean;
    router: boolean;
    redux: boolean;
    axios: boolean;
}
export declare type AppOptionsKeys = keyof AppOptions;
export interface ReactAppOptions extends AppOptions {
}
export interface NextAppOptions extends AppOptions {
}
export interface HookOptions {
    hooksDir: string;
    typescript: boolean;
    useEffect: boolean;
    useSelector: boolean;
    useState: boolean;
    useDispatch: boolean;
}
export interface CreateFileRecusrsion {
    (directoryPath: string, fileName: string): CreateFileRecusrsion;
}
