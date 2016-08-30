/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const sessionSchema = new mongodbDriver.Schema({
    _user: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Users' },
    userRoles: [String],

    accessToken: String,
    accessTokenExpiresAt: { type: Date },
    refreshToken: String,
    createdAt: { type: Date, 'default': Date.now },
    terminatedAt: { type: Date },

    details: {
        remoteAddr: String,
        userAgent: String,
        deviceId: String
    }
});

module.exports = sessionSchema;