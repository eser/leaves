'use strict';

const EventEmitter = require('events'),
    path = require('path'),
    fs = require('fs'),
    mongodbConnection = require('./mongodb.connection.js');

class dataLayer {
    constructor() {
        this.events = new EventEmitter();
        this.repositories = {};
    }

    start(options) {
        this.config = options;

        this.mongodbConnection = new mongodbConnection(this.config.mongodb);
        this.mongodbConnection.connect();
        this.mongodb = this.mongodbConnection.connection;

        this.loadRepositories();
    }

    loadRepositories() {
        this.repositories = {};

        this.readDir(
            'repositories',
            (file, dir) => {
                const stat = fs.statSync(`${dir}/${file}`);

                if (stat.isFile()) {
                    const basename = path.basename(file, '.js');

                    this.repositories[basename] = require(`${dir}/${file}`);
                }
            }
        );
    }

    readDir(relativePaths, callback) {
        const relativePathsConverted = (relativePaths.constructor === Array) ?
            relativePaths :
            [ relativePaths ];

        for (let relativePath of relativePathsConverted) {
            const dir = path.join(__dirname, relativePath),
                files = fs.readdirSync(dir);

            for (let file of files) {
                callback(file, dir);
            }
        }
    }

    tryClose(timeout = 0) {
        return Promise.all(
            [
                this.mongodbConnection.tryClose(timeout),
            ]
        );
    }
}

module.exports = new dataLayer();
