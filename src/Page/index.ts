import logger from '../Logger';

class Page {
  public generate = () => {
    logger.debug('page generate');
  };
}

export default new Page();
