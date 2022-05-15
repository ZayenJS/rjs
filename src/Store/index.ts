import { BaseFile } from '../Component/BaseFile/BaseFile';
import { Folder } from '../Folder';
import Logger from '../Logger';
import { Action } from './Action';
import { Reducer } from './Reducer';
import sh from '../Shell';

export interface StoreOptions {
  typescript: boolean;
  flat: boolean;
}

export class Store extends BaseFile<StoreOptions> {
  protected _dirPath = 'src/store';
  protected _possibleFileExtensions: [string, string] = ['ts', 'js'];
  private _generated = false;

  public constructor(options: StoreOptions) {
    super('index', options);
  }

  public create = async () => {
    await new Folder('src/store', ['actions', 'middlewares', 'reducers', 'selectors']).create();

    return this;
  };

  public generate = async (forceCreateFile = true) => {
    if (this._generated) return true;

    await this._generate(forceCreateFile);
    await new Reducer('index', this.options).generate(forceCreateFile);
    await new Reducer('template', this.options)
      .setData(this._getTemplateReducer())
      .generate(forceCreateFile);

    await new Folder('src/store/actions', ['template']).create();

    await new Action('index', this.options)
      .setData(this.parse([this.addLine(0, `export * from './template';`), this.addLine(0, '')]))
      .generate(forceCreateFile);

    await new Action('template/index', this.options)
      .setData(this._getTemplateIndex())
      .generate(forceCreateFile);

    await new Action('template/template.action', this.options)
      .setData(this._getTemplateActions())
      .generate(forceCreateFile);

    if (this.options.typescript) {
      await new Action('template/template.payload', this.options)
        .setData(this._getTemplatePayload())
        .generate(forceCreateFile);
    }

    return true;
  };

  protected getData = () => {
    const data = [
      this.addLine(0, `import { configureStore } from '@reduxjs/toolkit';`),
      this.addLine(0, ''),
      this.addLine(0, `import rootReducer from './reducers';`),
      this.addLine(0, ''),
      this.addLine(0, `const store = configureStore({`),
      this.addLine(1, `reducer: rootReducer,`),
      this.addLine(1, 'devTools: true,'),
      this.addLine(1, 'middleware: [],'),
      this.addLine(0, `});`),
      this.addLine(0, ''),
    ];

    if (this.options.typescript) {
      data.push(this.addLine(0, `export type State = ReturnType<typeof rootReducer>;`));
      data.push(this.addLine(0, ''));
    }

    data.push(this.addLine(0, `export default store;`));
    data.push(this.addLine(0, ''));

    return this.parse(data);
  };

  private _getTemplateReducer = () => {
    const data = [
      this.addLine(0, `import { createReducer } from '@reduxjs/toolkit';`),
      this.addLine(0, `import { setTemplate } from '../actions';`),
      this.addLine(0, ''),
    ];

    if (this.options.typescript) {
      data.push(this.addLine(0, `export type TemplateState = {`));
      data.push(this.addLine(1, `template: string;`));
      data.push(this.addLine(0, `};`));
      data.push(this.addLine(0, ''));
    }

    data.push(
      this.addLine(0, `const INITIAL_STATE${this.options.typescript ? ': TemplateState' : ''} = {`),
    );
    data.push(this.addLine(1, `template: '',`));
    data.push(this.addLine(0, `};`));

    data.push(
      this.addLine(0, `export const templateReducer = createReducer(INITIAL_STATE, (builder) => {`),
    );
    data.push(this.addLine(1, `builder.addCase(setTemplate, (state, action) => {`));
    data.push(this.addLine(2, `state.template = action.payload.template;`));
    data.push(this.addLine(1, `});`));
    data.push(this.addLine(0, `});`));
    data.push(this.addLine(0, ''));

    return this.parse(data);
  };

  private _getTemplateIndex = () =>
    this.parse([
      this.addLine(0, `export * from './template.action';`),
      this.options.typescript ? this.addLine(0, `export * from './template.payload';`) : null,
      this.addLine(0, ''),
    ]);

  private _getTemplateActions = () => {
    const data = [
      this.addLine(0, `import { createAction } from '@reduxjs/toolkit';`),
      this.options.typescript
        ? this.addLine(0, `import { SetTemplatePayload } from './template.payload';`)
        : null,
      this.addLine(0, ''),
    ];

    if (this.options.typescript) {
      data.push(
        this.addLine(0, `export enum TemplateActionType {`),
        this.addLine(1, `SET_TEMPLATE = 'SET_TEMPLATE',`),
      );
    } else {
      data.push(
        this.addLine(0, `export const TemplateActionType = {`),
        this.addLine(1, `SET_TEMPLATE: 'SET_TEMPLATE',`),
      );
    }

    data.push(
      this.addLine(0, `}`),
      this.addLine(0, ''),
      this.addLine(0, `export const setTemplate = createAction(`),
      this.addLine(1, `TemplateActionType.SET_TEMPLATE,`),
    );

    if (this.options.typescript) {
      data.push(this.addLine(1, `(payload: SetTemplatePayload) => ({ payload }),`));
    } else {
      data.push(this.addLine(1, `(payload) => ({ payload }),`));
    }

    data.push(this.addLine(0, `);`));
    data.push(this.addLine(0, ''));

    return this.parse(data);
  };

  private _getTemplatePayload = () => {
    const data = [
      this.addLine(0, `export interface SetTemplatePayload {`),
      this.addLine(1, `template: string;`),
      this.addLine(0, `}`),
      this.addLine(0, ''),
    ];

    return this.parse(data);
  };
}
