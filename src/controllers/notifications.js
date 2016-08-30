'use strict';

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
    async get(userId) {
        if (!validation.isDefined(userId) ||
            !validator.isMongoId(userId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const user = await dataLayer.models.userModel.getSingleById(userId);

        if (user === null) {
            throw new apiServer.protocolException(errors.targetUserNotAvailable);
        }

        const notificationRecords = await dataLayer.models.notificationModel.get();

        notificationRecords.map((item) => {
            if (user.lastNotificationSeen >= item._id) {
                item.isSeen = true;
            }
        });

        return {
            items: notificationRecords
        };
    }

    async getUnreadCount(userId) {
        if (!validation.isDefined(userId) ||
            !validator.isMongoId(userId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const user = await dataLayer.models.userModel.getSingleById(userId);

        if (user === null) {
            throw new apiServer.protocolException(errors.targetUserNotAvailable);
        }

        const notificationCount = await dataLayer.models.notificationModel.aggrCount(user.lastNotificationSeen);

        return {
            count: notificationCount
        };
    }

    async updateSeenAt(userId, lastNotificationId) {
        if (!validation.isDefined(userId, lastNotificationId) ||
            !validator.isMongoId(userId) ||
            !validator.isMongoId(lastNotificationId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const updatedRecord = await dataLayer.models.userModel.updateSingleById(
            userId,
            {
                $set: {
                    lastNotificationSeen: lastNotificationId
                }
            }
        );

        if (updatedRecord === null) {
            throw new apiServer.protocolException(errors.targetUserNotAvailable);
        }

        return updatedRecord;
    }
}

module.exports = new notifications();
