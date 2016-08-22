'use strict';

const validator = require('validator'),
    uuid = require('node-uuid'),
    apiServer = require('hex-api-server'),
    dataLayer = require('../data/'),
    validation = require('../utils/validation.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' },
    targetPageNotAvailable: { status: 404, message: 'target_page_not_available' }
};

class pages {
    async getById(pageId) {
        if (!validator.isMongoId(pageId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const pageRecord = await dataLayer.models.pageModel.getSingleById(pageId);

        if (pageRecord === null) {
            throw new apiServer.protocolException(errors.targetPageNotAvailable);
        }

        return {
            page: pageRecord
        };
    }

    async getByName(pageName) {
        // if (!validator.isMongoId(pageId)) {
        //     throw new apiServer.protocolException(errors.malformedRequest);
        // }

        const pageRecord = await dataLayer.models.pageModel.getSingleByName(pageName);

        if (pageRecord === null) {
            throw new apiServer.protocolException(errors.targetPageNotAvailable);
        }

        return {
            page: pageRecord
        };
    }

    async getAll() {
        const pageRecords = await dataLayer.models.pageModel.getAll();

        return {
            pages: pageRecords
        };
    }

    async search(queryText) {
        const pageRecords = await dataLayer.models.pageModel.search(queryText);

        return {
            pages: pageRecords
        };
    }
}

module.exports = new pages();
