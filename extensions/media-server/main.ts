import { KitesInstance } from '@kites/core';
import { Express } from '@kites/express';

/**
 * Media server setup
 *
 * @param {kites} kites
 */
function MediaServer(kites: KitesInstance) {
  kites.on('express:config', (app: Express) => {
    kites.logger.info('Configure media server ...');

  });
}

export {
  MediaServer,
};
