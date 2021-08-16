import logger from '../Logger';

class Container {
  public generate = () => {
    logger.debug('container generate');
  };
}

export default new Container();
