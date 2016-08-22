/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const entrySchema = new mongodbDriver.Schema({
    entry: String,

    properties: { Object: Object },

    tags: [String],

    content: String
});

entrySchema.index({
    content: 'text'
});

module.exports = entrySchema;