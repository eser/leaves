'use strict';

const dataLayer = require('../'),
    notificationSchema = require('../schemas/notificationSchema.js');

class notificationModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Notifications', notificationSchema);
    }

    // --- get methods
    async getSingleById(id) {
        const notificationRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return notificationRecord;
    }

    async get() {
        const query = this.model.where({
            isAvailable: true
        });

        const notificationRecords = await query.lean()
        .find()
        .exec();

        return notificationRecords;
    }

    // --- aggregate methods
    async aggrCount(lastNotificationSeen) {
        const whereCondition = {
            isAvailable: true
        };

        if (lastNotificationSeen) {
            whereCondition._id = { $gt: lastNotificationSeen };
        }

        const notificationRecordCount = await this.model.where(whereCondition)
        .count()
        .exec();

        return notificationRecordCount;
    }

    // --- insert methods
    async add(title, briefImage, briefText, fullImage, fullMessage) {
        return await this.insert({
            createdAt: new Date(),
            isAvailable: true,

            title: title,

            briefImage: briefImage,
            briefMessage: briefMessage,

            fullImage: fullImage,
            fullMessage: fullMessage
        });
    }

    async insert(data) {
        const model = new this.model(data);

        const notificationRecord = await model.save();

        return notificationRecord;
    }

    // --- remove methods
    async removeSingleById(id) {
        const result = await this.model.findOneAndRemove({
            _id: id
        })
        .exec();

        return result;
    }
}

module.exports = new notificationModel();
