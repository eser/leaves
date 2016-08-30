/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const validator = require('validator'),
      apiServer = require('hex-api-server'),
      dataLayer = require('../data/'),
      validation = require('../utils/validation.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' }
};

class feedback {
    post(targetUserId, targetSessionId, feedbackDetail) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(targetUserId, feedbackDetail) || !validator.isMongoId(targetUserId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const feedbackRecord = {
                _session: targetSessionId,
                _user: targetUserId,

                subject: feedbackDetail.subject,
                message: feedbackDetail.message
            };

            yield dataLayer.models.feedbackModel.insert(feedbackRecord);

            // TODO send mail
        })();
    }
}

module.exports = new feedback();