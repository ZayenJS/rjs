import { ComponentOptions } from '../../@types';
import { ComponentFile } from '../ComponentFile';

export class AppEntryPoint extends ComponentFile {
  constructor(options: ComponentOptions, private readonly packages: string[]) {
    super({
      name: 'index',
      options: {
        ...options,
        flat: true,
      },
      dirPath: 'src',
    });
  }

  public generate = async (forceCreateFile = true) => {
    return this._generate(
      this._name,
      this._options.typescript ? 'tsx' : 'js',
      'entry point',
      forceCreateFile,
    );
  };

  protected getHeaderImports = () => {
    const headerImports = [
      this.addLine(0, "import { StrictMode } from 'react';"),
      this.addLine(0, "import ReactDOM from 'react-dom/client';"),
      this.addLine(
        0,
        this.packages.includes('react-router-dom')
          ? "import { BrowserRouter as Router } from 'react-router-dom';"
          : null,
      ),
      this.addLine(
        0,
        this.packages.includes('redux') ? "import { Provider } from 'react-redux';" : null,
      ),
      this.addLine(0, "import reportWebVitals from './reportWebVitals';"),
      this.addLine(0, ''),
    ];

    headerImports.push(this.addLine(0, "import App from './App/App';"), this.addLine(0, ''));

    if (this.packages.includes('redux')) {
      headerImports.push(this.addLine(0, "import store from './store';"), this.addLine(0, ''));
    }

    return headerImports;
  };

  protected getData = () => {
    const styles = [];

    if (this._options.styling === 'scss') {
      styles.push(this.addLine(0, "import './assets/scss/index.scss';"));
    } else if (this._options.styling === 'css') {
      styles.push(this.addLine(0, "import './assets/css/reset.css';"));
      styles.push(this.addLine(0, "import './assets/css/index.css';"));
    }

    const data = [
      ...this.getHeaderImports(),
      ...styles,
      this.addLine(0, ''),
      this.addLine(
        0,
        `const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);`,
      ),
      this.addLine(0, ''),
      this.addLine(0, 'root.render('),
      this.addLine(1, '<StrictMode>'),
    ];

    const appWrappingComponents = [];

    if (this.packages.includes('react-router-dom')) {
      appWrappingComponents.push(this.addLine(2, '<Router>'));
    }

    if (this.packages.includes('redux')) {
      const indentation = appWrappingComponents.length > 0 ? 3 : 2;
      appWrappingComponents.push(this.addLine(indentation, '<Provider store={store}>'));
    }

    appWrappingComponents.push(this.addLine(appWrappingComponents.length + 2, '<App />'));

    if (this.packages.includes('redux')) {
      const indentation = appWrappingComponents.length > 1 ? 3 : 2;
      appWrappingComponents.push(this.addLine(indentation, '</Provider>'));
    }

    if (this.packages.includes('react-router-dom')) {
      appWrappingComponents.push(this.addLine(2, '</Router>'));
    }

    data.push(...appWrappingComponents);

    data.push(
      this.addLine(1, '</StrictMode>,'),
      this.addLine(0, ');'),
      this.addLine(0, ''),
      this.addLine(0, '// If you want to start measuring performance in your app, pass a function'),
      this.addLine(0, '// to log results (for example: reportWebVitals(console.log))'),
      this.addLine(0, '// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals'),
      this.addLine(0, 'reportWebVitals();'),
      this.addLine(0, ''),
    );

    return this.parse(data);
  };
}
