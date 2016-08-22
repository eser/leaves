/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const pageSchema = new mongodbDriver.Schema({
    name: String,
    content: String,

    entries: {
        type: String,
        tag: String,
        category: String,
        value: String
    }
});

pageSchema.index({
    content: 'text'
});

module.exports = pageSchema;