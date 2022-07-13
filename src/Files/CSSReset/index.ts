import fsp from 'fs/promises';
import path from 'path';
import { StyleFile } from '../StyleFile';

export class CSSReset extends StyleFile {
  protected getData = async () => {
    return fsp.readFile(path.join(__dirname, '..', '..', '..', 'templates', '_reset.scss'), 'utf8');
  };
}
