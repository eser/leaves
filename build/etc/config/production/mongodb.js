/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

module.exports = {
    mongodb: {
        host: 'data01.hexajans.com',
        port: 27017,
        database: 'leaves',

        username: 'leavese',
        password: 'TRNCKKTC19931998',

        options: {
            /*
            replset: {
                // rs_name: 'rs0',
                poolSize: 10,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                }
            },
            */
            server: {
                auto_reconnect: false,
                poolSize: 5,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                }
            },
            db: {
                bufferMaxEntries: 0
            }
        }
    }
};