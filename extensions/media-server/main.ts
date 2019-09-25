import { KitesInstance } from '@kites/core';
import { Express } from '@kites/express';

import { platform } from 'os';

/**
 * Media server setup
 *
 * @param {kites} kites
 */
function MediaServer(kites: KitesInstance) {

  const type = platform();
  if (type === 'linux') {
    kites.on('express:config', (app: Express) => {
      kites.logger.info('Configure media server ...');

    });
  } else {
    kites.logger.error(`Media server run only on linux platform or WSL! Currently do not support: ${type}!`);
  }
}

export {
  MediaServer,
};
