'use strict'
const engine = require('@kites/engine');

/**
 * Init kites
 */
var kites = engine({
    loadConfig: true,
    discover: true
});

kites
    .use(require('./content/extensions/detectEnv'))
    .use(require('./content/extensions/nativeModel'))
    .use(require('./content/extensions/configRoutes'))
    .init()
    .then(function (kites) {
        kites.logger.info('Info: Web Server is Ready!!!')
    })
    .catch(function (e) {
        console.error(e.stack);
        process.exit(1);
    });

module.exports = kites;