import path from 'path';
import shell from '../../Shell';
import { BaseFile } from '../../Component/BaseFile/BaseFile';
import fileUtil from '../../FileUtil';
import logger from '../../Logger';
import { HookOptions } from '../../@types';

export class HookFile extends BaseFile<HookOptions> {
  public generate = async () => {
    if (!this.name.startsWith('use')) logger.exit('Hooks must start with "use"!');
    // ? ACTIVATE THIS TO TEST OUTPUT IN SHELL
    // logger.exit(this.options);

    const hookFileName = `${this.name}.${this.options.typescript ? 'ts' : 'js'}`;
    this._nameWithExtension = hookFileName;
    const dirPath = this.options.hooksDir;

    const hookFile = await fileUtil.createFile(path.join(dirPath), hookFileName);

    let response = true;

    if (hookFile) {
      const { overwrite } = await shell.alreadyExistPromp(
        `The hook ${hookFileName} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response) {
      await fileUtil.writeToFile(path.join(dirPath, hookFileName), this.getData());
    }

    return response;
  };

  protected getData = () =>
    [...this.addImports(), this.addLine(0, ''), ...this.addFunctionBody()]
      .filter((line) => typeof line === 'string')
      .join('\n');

  private addImports = () => {
    const { useDispatch, useEffect, useSelector, useState } = this.options;

    let imports = `import { `;

    const hooks = [];

    if (useState) hooks.push('useState');
    if (useEffect) hooks.push('useEffect');
    if (useSelector) hooks.push('useSelector');
    if (useDispatch) hooks.push('useDispatch');

    imports += `${hooks.join(', ')} } from 'react';`;

    return hooks.length ? [this.addLine(0, imports)] : '';
  };

  private addFunctionBody = () => {
    const { useDispatch, useEffect, useSelector, useState, typescript } = this.options;

    const state = useState ? this.addLine(1, 'const [state, setState] = useState({});') : null;
    const dispatch = useDispatch ? this.addLine(1, 'const dispatch = useDispatch();') : null;
    const effect = useEffect ? this.addLine(1, 'useEffect(() => {}, []);') : null;
    const selector = useSelector
      ? this.addLine(
          1,
          `const selector = useSelector((state) => {});${
            typescript ? ' // TODO: type the state parameter' : ''
          }`,
        )
      : null;

    return [
      this.addLine(0, `export const ${this.name} = () => {`),
      state,
      selector,
      dispatch,
      this.addLine(0, ``),
      effect,
      this.addLine(0, ``),
      this.addLine(1, 'return {}; // TODO?: return value from hook'),
      this.addLine(0, `}`),
    ];
  };
}
