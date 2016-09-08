'use strict';

const dataLayer = require('../'),
    feedbackSchema = require('../schemas/feedbackSchema.js');

class feedbackModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Feedbacks', feedbackSchema);
    }

    // --- get methods
    async getSingleById(id) {
        const feedbackRecord = await this.model.where({
            _id: id
        })
        .lean()
        .findOne()
        .exec();

        return feedbackRecord;
    }

    // --- insert methods
    async insert(data) {
        const model = new this.model(data);

        const feedbackRecord = await model.save();

        return feedbackRecord;
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

module.exports = new feedbackModel();
