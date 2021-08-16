import chalk from 'chalk';

class Logger {
  public exit = (...errors: unknown[]) => {
    console.error(chalk`[{red EXIT}]:`, ...errors);
    process.exit(1);
  };

  public error = (...errors: unknown[]) => console.error(chalk`[{red ERROR}]:`, ...errors);

  public debug = (...messages: unknown[]) => console.log(chalk`[{cyan DEBUG}]:`, ...messages);

  public log = (color: string, message: unknown) => console.log(chalk`{${color} ${message}}`);
}

export default new Logger();
