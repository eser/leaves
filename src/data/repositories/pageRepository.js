'use strict';

const dataLayer = require('../'),
    pageSchema = require('../schemas/pageSchema.js');

class pageModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Pages', pageSchema);
    }

    // --- get methods
    async getSingleById(id) {
        const pageRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return pageRecord;
    }

    async getSingleByName(name) {
        const pageRecord = await this.model.where({
            name: name
        })
        .lean()
        .findOne()
        .exec();

        return pageRecord;
    }

    async getAll() {
        const pageRecords = await this.model.where({
        })
        .select('_id name type')
        .sort({ type: 'asc', name: 'asc' })
        .lean()
        .find()
        .exec();

        return pageRecords;
    }

    // --- query methods
    async search(queryText) {
        const pageRecords = await this.model.find(
            { $text: { $search: queryText } },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
        .exec();

        return pageRecords;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const insertedPageRecord = await model.save();

        return insertedPageRecord;
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

module.exports = new pageModel();
