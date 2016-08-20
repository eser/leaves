'use strict';

const dataLayer = require('../'),
    entrySchema = require('../schemas/entrySchema.js');

class entryModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Entries', entrySchema);
    }

    // --- get methods
    async getSingleById(id) {
        const entryRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return entryRecord;
    }

    async getByCategory(key, value) {
        const entryRecords = await this.model.where({
            [`categories.${key}`]: value
        })
        .sort({ entry: 'asc' })
        .lean()
        .find()
        .exec();

        return entryRecords;
    }

    async getByTag(tag) {
        const entryRecords = await this.model.where({
            tags: tag
        })
        .sort({ entry: 'asc' })
        .lean()
        .find()
        .exec();

        return entryRecords;
    }

    // --- query methods
    async search(queryText) {
        const entryRecords = await this.model.find(
            { $text: { $search: queryText } },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
        .exec();

        return entryRecords;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const insertedEntryRecord = await model.save();

        return insertedEntryRecord;
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

module.exports = new entryModel();
