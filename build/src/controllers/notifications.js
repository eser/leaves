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
    malformedRequest: { status: 400, message: 'malformed_request' },
    targetUserNotAvailable: { status: 404, message: 'target_user_not_available' },
    exception: { status: 500, message: 'exception' }
};

class notifications {
    get(userId) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(userId) || !validator.isMongoId(userId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const user = yield dataLayer.repositories.userRepository.getSingleById(userId);

            if (user === null) {
                throw new apiServer.protocolException(errors.targetUserNotAvailable);
            }

            const notificationRecords = yield dataLayer.repositories.notificationRepository.get();

            notificationRecords.map(function (item) {
                if (user.lastNotificationSeen >= item._id) {
                    item.isSeen = true;
                }
            });

            return {
                items: notificationRecords
            };
        })();
    }

    getUnreadCount(userId) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(userId) || !validator.isMongoId(userId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const user = yield dataLayer.repositories.userRepository.getSingleById(userId);

            if (user === null) {
                throw new apiServer.protocolException(errors.targetUserNotAvailable);
            }

            const notificationCount = yield dataLayer.repositories.notificationRepository.aggrCount(user.lastNotificationSeen);

            return {
                count: notificationCount
            };
        })();
    }

    updateSeenAt(userId, lastNotificationId) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(userId, lastNotificationId) || !validator.isMongoId(userId) || !validator.isMongoId(lastNotificationId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const updatedRecord = yield dataLayer.repositories.userRepository.updateSingleById(userId, {
                $set: {
                    lastNotificationSeen: lastNotificationId
                }
            });

            if (updatedRecord === null) {
                throw new apiServer.protocolException(errors.targetUserNotAvailable);
            }

            return updatedRecord;
        })();
    }
}

module.exports = new notifications();