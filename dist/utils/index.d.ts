/// <reference types="node" />
import fs from 'fs/promises';
export declare const hasNoOptions: (options: {}) => boolean;
export declare const isFileHandle: (data: any) => data is fs.FileHandle;
