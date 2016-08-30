'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const notificationSchema = new mongodbDriver.Schema({
    createdAt: { type: Date, 'default': Date.now },
    isAvailable: Boolean,

    title: String,

    briefImage: String,
    briefMessage: String,

    fullImage: String,
    fullMessage: String
});

module.exports = notificationSchema;
