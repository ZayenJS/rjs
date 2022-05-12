import chalk from 'chalk';

class Logger {
  public exit = (...errors: unknown[]) => {
    console.error(chalk`[{red EXIT}]:`, ...errors);

    process.exit(1);
  };

  public error = (...errors: unknown[]) => console.error(chalk`[{red ERROR}]:`, ...errors);

  public debug = (...messages: unknown[]) => console.log(chalk`[{cyan DEBUG}]:`, ...messages);

  public info = (...messages: unknown[]) => console.log(chalk`[{blue INFO}]:`, ...messages);

  public comingSoon = (...messages: unknown[]) =>
    console.log(chalk`[{yellow COMING SOON}]:`, ...messages);

  public log = (color: string, message: unknown) => console.log(chalk`{${color} ${message}}`);

  public italic = (color: string, message: unknown) =>
    console.log(chalk.italic`{${color} ${message}}`);
}

export default new Logger();
