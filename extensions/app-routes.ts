import { KitesInstance } from '@kites/core';
import { Express } from '@kites/express';

import { renderToString } from 'react-dom/server';
import React from 'react';

// import { TMPL_CONFERENCE_INDEX } from './data/react-template';
import Counter from '../client/src/containers/counter';
import html from './templates/html-conference';

/**
 * Routes management
 *
 * @param {kites} kites
 */
function AppRoutes(kites: KitesInstance) {
  kites.on('express:config', (app: Express) => {
    kites.logger.info('Configure page views ...');

    // quick setup
    app.get('/', (req, res) => res.view('index'));
    app.get('/admin', (req, res) => res.view('admin'));
    app.get('/about', (req, res) => res.view('about'));

    // channel or conference room
    app.get('/channel/:id', (req, res) => {
      // const hbsTemplate = hbs.compile(TMPL_CONFERENCE_INDEX);
      // const reactComp = renderToString(React.createElement(Counter));
      // const htmlToSend = hbsTemplate({ reactele: reactComp, version: React.version });
      const e = React.createElement(Counter);
      const body = renderToString(e);
      kites.logger.debug('Render channel: ' + body);

      res.send(
        html({
          body,
        }),
      );
    });

    // error handler
    app.use((err, req, res, next) => {
      kites.logger.error('Error: ', err);
      res.status(500).json(err.message);
    });
  });

  /**
   * Cấu hình file tĩnh
   */
  kites.on('express:config:static', async (app: Express) => {
    const e = await import('express');
    app.use(e.static('build/client'));
  });
}

export {
  AppRoutes,
};
