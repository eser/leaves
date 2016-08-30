'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const confirmationSchema = new mongodbDriver.Schema({
    _user: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Users' },
    type: Number,
    createdAt: { type: Date, 'default': Date.now },
    code: String,
    confirmedAt: { type: Date },

    details: {
        remoteAddr: String,
        userAgent: String,
        deviceId: String
    }
});

module.exports = confirmationSchema;
