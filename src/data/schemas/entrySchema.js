'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const entrySchema = new mongodbDriver.Schema({
    entry: String,

    categories: { Object },

    tags: [ String ],

    content: String
});

entrySchema.index({
    content: 'text'
});

module.exports = entrySchema;
