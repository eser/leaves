'use strict';

const dataLayer = require('../'),
    invitationSchema = require('../schemas/invitationSchema.js');

class invitationModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Invitations', invitationSchema);
    }

    // --- get methods
    async getSingleById(id) {
        const invitationRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return invitationRecord;
    }

    async getSingleByCode(code) {
        const invitationRecord = await this.model.where({
            code: code,
            isUsed: false
        })
        // .populate('_user')
        .lean()
        .findOne()
        .exec();

        return invitationRecord;
    }

    async getFirstAvailableByUser(userId) {
        const invitationRecord = await this.model.where({
            _user: userId,
            isUsed: false
        })
        .lean()
        .findOne()
        .exec();

        return invitationRecord;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const invitationRecord = await model.save();

        return invitationRecord;
    }

    // --- update methods
    async updateSingleById(id, data) {
        const result = await this.model.findOneAndUpdate(
            {
                _id: id
            },
            data,
            {
                'new': true
            }
        )
        .lean();

        return result;
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

module.exports = new invitationModel();
