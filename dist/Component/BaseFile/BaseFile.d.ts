export declare abstract class BaseFile<T> {
    protected name: string;
    protected options: T;
    protected _nameWithExtension: string;
    getFileName: () => string;
    constructor(name: string, options: T);
    protected addLine: (tabs?: number, str?: string | null) => string | null;
    protected abstract getData: (name: string) => void;
    abstract generate: () => Promise<boolean>;
}
