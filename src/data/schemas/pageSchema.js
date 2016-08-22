'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const pageSchema = new mongodbDriver.Schema({
    name: String,
    type: String,
    content: String,

    bindEntries: {
        type: String,
        tag: String,
        property: String,
        value: String
    }
});

pageSchema.index({
    content: 'text'
});

module.exports = pageSchema;
