'use strict';

const dataLayer = require('../'),
    confirmationSchema = require('../schemas/confirmationSchema.js');

class confirmationModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Confirmations', confirmationSchema);

        // --- enums
        this.typeValues = {
            EMAIL_ADDRESS: 1,
            PHONE_NUMBER: 2
        };
    }

    // --- get methods
    async getSingleById(id) {
        const confirmationRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return confirmationRecord;
    }

    async getSingleByTypeAndCode(userId, type, code) {
        const confirmationRecord = await this.model.where({
            _user: userId,
            type: type,
            code: code,
            confirmedAt: undefined
        })
        .lean()
        .findOne()
        .exec();

        return confirmationRecord;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const confirmationRecord = await model.save();

        return confirmationRecord;
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

module.exports = new confirmationModel();
