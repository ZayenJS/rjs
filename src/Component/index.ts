import logger from '../Logger';

class Component {
  public generate = () => {
    logger.debug('generate component');
  };
}

export default new Component();
