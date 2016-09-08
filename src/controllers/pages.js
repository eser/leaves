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

        const pageRecord = await dataLayer.repositories.pageRepository.getSingleById(pageId);

        if (pageRecord === null) {
            throw new apiServer.protocolException(errors.targetPageNotAvailable);
        }

        let entryRecords;
        if (pageRecord.bindEntries.type === 'property') {
            entryRecords = await dataLayer.repositories.entryRepository.getByProperty(pageRecord.bindEntries.property, pageRecord.bindEntries.value);
        }
        else {
            entryRecords = await dataLayer.repositories.entryRepository.getByTag(pageRecord.bindEntries.tag);
        }

        return {
            page: pageRecord,
            entries: entryRecords
        };
    }

    async getByName(pageName) {
        // if (!validator.isMongoId(pageId)) {
        //     throw new apiServer.protocolException(errors.malformedRequest);
        // }

        const pageRecord = await dataLayer.repositories.pageRepository.getSingleByName(pageName);

        if (pageRecord === null) {
            throw new apiServer.protocolException(errors.targetPageNotAvailable);
        }

        let entryRecords;
        if (pageRecord.bindEntries.type === 'property') {
            entryRecords = await dataLayer.repositories.entryRepository.getByProperty(pageRecord.bindEntries.property, pageRecord.bindEntries.value);
        }
        else {
            entryRecords = await dataLayer.repositories.entryRepository.getByTag(pageRecord.bindEntries.tag);
        }

        return {
            page: pageRecord,
            entries: entryRecords
        };
    }

    async getAll() {
        const pageRecords = await dataLayer.repositories.pageRepository.getAll();

        return {
            pages: pageRecords
        };
    }

    async search(queryText) {
        const pageRecords = await dataLayer.repositories.pageRepository.search(queryText);

        return {
            pages: pageRecords
        };
    }
}

module.exports = new pages();
