/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const apiServer = require('hex-api-server'),
      dataLayer = require('./data/');

const basedir = `${ __dirname }/..`;

console.log(`Environment: ${ process.env.NODE_ENV } on ${ process.env.PORT }`);

apiServer.init({
    dir: basedir,
    i18n: {
        locales: ['en', 'tr'],
        defaultLocale: 'en'
    },
    autoload: true
});

// data layer
dataLayer.start(apiServer.config);
apiServer.register('dataLayer', dataLayer);

apiServer.events.on('terminate', () => {
    // async?
    dataLayer.tryClose(5000);
});

// routes
apiServer.addRouter('/', require(`${ basedir }/src/routing/`));

module.exports = apiServer.app;