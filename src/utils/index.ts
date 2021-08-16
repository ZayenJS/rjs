import fs from 'fs/promises';

export const hasNoOptions = (options: {}) => Object.keys(options).length <= 0;

export const isFileHandle = (data: any): data is fs.FileHandle => {
  try {
    return 'close' in data;
  } catch {
    return false;
  }
};
