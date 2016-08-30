/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const mongodbDriver = require('../mongodb.driver.js');

const userSchema = new mongodbDriver.Schema({
    email: String, /* unique */
    emailVerified: Boolean,
    password: String,
    roles: [String],
    firstname: String,
    lastname: String,
    gender: Number,
    birthDate: { type: Date },
    phone: String, /* unique? */
    phoneVerified: Boolean,
    profilePhoto: String,
    profilePhotoOriginal: String,
    createdAt: { type: Date, 'default': Date.now },
    _invitedBy: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Users' },

    lastNotificationSeen: { type: mongodbDriver.Schema.Types.ObjectId, ref: 'Notifications' },

    extra: Object,

    settings: {
        language: String,
        pushNotifications: Boolean
    }
});

userSchema.index({
    lastLocation: {
        loc: '2dsphere'
    },
    email: 'text',
    firstname: 'text',
    lastname: 'text'
});

module.exports = userSchema;