'use strict';

const entriesController = require('../../controllers/entries.js'),
    templates = require('../../utils/templates.js');

class entries {

    static getById(req, res, next) {
        entriesController.getById(req.params.id)
            .then((result) => {
                templates.process(req, res, 'entries/id', result);
            })
            .catch(next);
    }

    static getByProperty(req, res, next) {
        entriesController.getByProperty(req.params.property, req.params.value)
            .then((result) => {
                templates.process(req, res, 'entries/property', result);
            })
            .catch(next);
    }

    static getByTag(req, res, next) {
        entriesController.getByTag(req.params.tag)
            .then((result) => {
                templates.process(req, res, 'entries/tag', result);
            })
            .catch(next);
    }

    static search(req, res, next) {
        entriesController.search(req.query.q)
            .then((result) => {
                templates.process(req, res, 'entries/search', result);
            })
            .catch(next);
    }
}

module.exports = entries;
