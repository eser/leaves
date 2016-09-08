'use strict';

const validator = require('validator'),
    uuid = require('node-uuid'),
    apiServer = require('hex-api-server'),
    dataLayer = require('../data/'),
    validation = require('../utils/validation.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' },
    targetEntryNotAvailable: { status: 404, message: 'target_entry_not_available' }
};

class entries {
    async getById(entryId) {
        if (!validator.isMongoId(entryId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const entryRecord = await dataLayer.repositories.entryRepository.getSingleById(entryId);

        if (entryRecord === null) {
            throw new apiServer.protocolException(errors.targetEntryNotAvailable);
        }

        return {
            entry: entryRecord
        };
    }

    async getByProperty(property, value) {
        const entryRecords = await dataLayer.repositories.entryRepository.getByProperty(property, value);

        return {
            entries: entryRecords
        };
    }

    async getByTag(tag) {
        const entryRecords = await dataLayer.repositories.entryRepository.getByTag(tag);

        return {
            entries: entryRecords
        };
    }

    async search(queryText) {
        const entryRecords = await dataLayer.repositories.entryRepository.search(queryText);

        return {
            entries: entryRecords
        };
    }
}

module.exports = new entries();
