declare class Logger {
    exit: (...errors: unknown[]) => never;
    error: (...errors: unknown[]) => void;
    debug: (...messages: unknown[]) => void;
    log: (color: string, message: unknown) => void;
}
declare const _default: Logger;
export default _default;
