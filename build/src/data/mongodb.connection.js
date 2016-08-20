/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const mongodbDriver = require('./mongodb.driver.js');

class mongodbConnection {
    constructor(connectionParameters) {
        this.connectionStates = {
            DISCONNECTED: 0,
            CONNECTING: 1,
            CONNECTED: 2,
            DISCONNECTING: 3
        };

        this.connection = null;
        this.connectionState = this.connectionStates.DISCONNECTED;

        this.setConnectionParameters(connectionParameters);
    }

    setConnectionParameters(connectionParameters) {
        this.connectionString = `mongodb://${ connectionParameters.host || 'localhost' }:${ String(connectionParameters.port || 27017) }/${ connectionParameters.database }`;

        this.connectionOptions = connectionParameters.options || {};
        if (connectionParameters.username !== undefined) {
            this.connectionOptions.user = connectionParameters.username;
            this.connectionOptions.pass = connectionParameters.password;
        }
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connection = mongodbDriver.createConnection();
            this.connection.connectionClass = this;
            this.connectionState = this.connectionStates.CONNECTING;

            this.connection.on('disconnected', this.onDisconnected);

            this.connection.open(this.connectionString, this.connectionOptions, () => {
                this.connectionState = this.connectionStates.CONNECTED;

                console.log('mongodb connected');
                resolve();
            });
        });
    }

    onDisconnected() {
        const conn = this.connectionClass;

        conn.connection = null;
        conn.connectionState = conn.connectionStates.CONNECTING;

        setTimeout(() => {
            conn.connect();
        }, 1000);
        console.log('mongodb reconnecting');
    }

    tryClose() {
        let timeout = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        return new Promise((resolve, reject) => {
            if (this.connectionState === this.connectionStates.DISCONNECTED) {
                resolve();

                return;
            }

            const closure = () => {
                if (this.connectionState !== this.connectionStates.DISCONNECTED) {
                    this.connection = null;
                    this.connectionState = this.connectionStates.DISCONNECTED;

                    console.log('mongodb close');
                    resolve();
                }
            };

            if (this.connection !== null) {
                this.connectionState = this.connectionStates.DISCONNECTING;
                this.connection.removeListener('disconnected', this.onDisconnected);

                // if connection close fails don't wait too much.
                if (timeout > 0) {
                    setTimeout(closure, timeout);
                }

                this.connection.close(closure);
            } else {
                closure();
            }
        });
    }
}

module.exports = mongodbConnection;