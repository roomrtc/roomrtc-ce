import { KitesFactory, KitesInstance } from '@kites/core';
import Express from '@kites/express';
import Rest from '@kites/rest';
import { UserService } from './api';

import * as mongoose from 'mongoose';
import { MongoDbServerDev, appRoutes } from './content/extensions';

async function bootstrap() {
  const app = await KitesFactory
    .create({
      loadConfig: true,
      discover: true,
      providers: [
        UserService,
        // TextService,
      ],
    })
    .use(appRoutes)
    .use(MongoDbServerDev)
    .on('db:connect', (uri: string, kites: KitesInstance) => {
      if (typeof uri === 'string') {
        mongoose.connect(uri, { useNewUrlParser: true });
        kites.logger.info('Mongodb connect ok: ' + uri);
      } else {
        // get connection string from kites.config
        kites.logger.error('Please config mongodb connection!!!');
      }
    })
    .init();

  app.logger.info(`Server started!`);
}

bootstrap();
