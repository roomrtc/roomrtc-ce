import { KitesFactory, KitesInstance } from '@kites/core';
import { UserService } from './api';

import mongoose from 'mongoose';
import { MongoDbServerDev, AppRoutes, MediaServer } from './extensions';

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
    .use(AppRoutes)
    .use(MediaServer)
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
