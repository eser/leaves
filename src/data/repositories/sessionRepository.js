'use strict';

const dataLayer = require('../'),
    sessionSchema = require('../schemas/sessionSchema.js');

class sessionModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Sessions', sessionSchema);
    }

    // --- get methods
    async getSingleByIdAndRefreshToken(id, refreshToken) {
        const sessionRecord = await this.model.where({
            _id: id,
            refreshToken: refreshToken,
            terminatedAt: undefined
        })
        .lean()
        .findOne()
        .exec();

        return sessionRecord;
    }

    async getSingleByIdAndAccessToken(id, accessToken) {
        const sessionRecord = await this.model.where({
            _id: id,
            accessToken: accessToken,
            $or: [
                { accessTokenExpiresAt: { $gte: Date.now() } },
                { accessTokenExpiresAt: undefined }
            ],
            terminatedAt: undefined
        })
        // .populate('_user')
        .lean()
        .findOne()
        .exec();

        return sessionRecord;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const insertedSessionRecord = await model.save();

        return insertedSessionRecord;
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
}

module.exports = new sessionModel();
