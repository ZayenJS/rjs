export interface ConfigFileOptions {
    type?: 'react' | 'next';
    importReact?: boolean;
    typescript?: boolean;
    styling?: 'scss' | 'css' | 'mui' | 'styled';
    stylingModules?: boolean;
    componentType?: 'function' | 'class';
    componentDir?: string;
}
