'use strict';

const dataLayer = require('../'),
    userSchema = require('../schemas/userSchema.js');

class userModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Users', userSchema);

        // --- enums
        this.genderValues = {
            UNSPECIFIED: 0,
            MALE: 1,
            FEMALE: 2
        };
    }

    // --- get methods
    async getSingleById(id) {
        const userRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return userRecord;
    }

    async getSingleByEmail(email) {
        const userRecord = await this.model.where({
            email: email
        })
        .lean()
        .findOne()
        .exec();

        return userRecord;
    }

    async getSingleByPhone(phone) {
        const userRecord = await this.model.where({
            phone: phone
        })
        .lean()
        .findOne()
        .exec();

        return userRecord;
    }

    // --- query methods
    async search(queryText) {
        const userRecords = await this.model.find(
            { $text: { $search: queryText } },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
        .exec();

        return userRecords;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const insertedUserRecord = await model.save();

        return insertedUserRecord;
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
}

module.exports = new userModel();
