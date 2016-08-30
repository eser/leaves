/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const feedbackSchema = new mongodbDriver.Schema({
    _session: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Sessions' },
    _user: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Users' },

    subject: String,
    message: String
});

module.exports = feedbackSchema;