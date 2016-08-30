'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const invitationSchema = new mongodbDriver.Schema({
    _session: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Sessions' },
    _user: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Users' },

    code: String,
    isUsed: Boolean
});

module.exports = invitationSchema;
