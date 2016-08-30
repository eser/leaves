'use strict';

const validator = require('validator'),
    apiServer = require('hex-api-server'),
    dataLayer = require('../data/'),
    validation = require('../utils/validation.js'),
    shared = require('./shared.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' }
};

class feedback {
    async post(targetUserId, targetSessionId, feedbackDetail) {
        if (!validation.isDefined(targetUserId, feedbackDetail) ||
            !validator.isMongoId(targetUserId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const feedbackRecord = {
            _session: targetSessionId,
            _user: targetUserId,

            subject: feedbackDetail.subject,
            message: feedbackDetail.message
        };

        await dataLayer.models.feedbackModel.insert(feedbackRecord);

        // TODO send mail
    }
}

module.exports = new feedback();
