export interface ConfigFileOptions {
    type: 'react' | 'next';
    importReact: boolean;
    typescript: boolean;
    styling: 'scss' | 'css' | 'mui' | 'styled';
    cssModules: boolean;
    componentType: 'function' | 'class';
    componentDir: string;
    containerDir: string;
    pageDir: string;
    packageManager: 'npm' | 'yarn';
}
export declare type ConfigFileKeys = keyof ConfigFileOptions;
export interface ComponentOptions {
    importReact: boolean;
    componentDir: string;
    typescript: boolean;
    styling: 'scss' | 'css' | 'mui' | 'styled' | 'none';
    cssModules: boolean;
    componentType: 'function' | 'class';
    tag: string;
}
export interface CreatFileRecusrsion {
    (directoryPath: string, fileName: string): CreatFileRecusrsion;
}
