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
      providers: [
        UserService,
        // TextService,
      ],
    })
    .use(Express)
    .use(Rest)
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
    .ready((kites: KitesInstance) => {
      kites.logger.info('Extra config app when ready!');

      kites.express.app.use((err, req, res, next) => {
        console.error('Error: ', err);
        res.status(500).json(err.message);
      });
    })
    .init();

  app.logger.info(`Server started!`);
}

bootstrap();
