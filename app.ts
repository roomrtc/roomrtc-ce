import { KitesFactory, KitesInstance } from '@kites/core';
import { UserService, User } from './api';

import mongoose from 'mongoose';
import { GetDbConnection, AppRoutes, MediaServer } from './extensions';

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
    .use(GetDbConnection)
    .on('db:connect', async (uri: string, kites: KitesInstance) => {
      if (typeof uri === 'undefined') {
        kites.logger.error('Please config mongodb connection!!!');
        return;
      }

      mongoose.connect(uri, { useNewUrlParser: true });
      kites.logger.info('Mongodb connect ok: ' + uri);

      if (kites.options.env === 'development') {
        const vUser = new User();
        vUser.username = 'admin';
        vUser.password = 'admin';
        const svUser = kites.container.inject(UserService);
        await svUser.create(vUser);
        kites.logger.info('Add default admin(todo:hash) user for testing!');
      }
    })
    .init();

  app.logger.info(`Server started!`);
}

bootstrap();
