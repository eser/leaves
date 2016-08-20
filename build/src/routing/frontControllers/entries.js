/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const entriesController = require('../../controllers/entries.js'),
      templates = require('../../utils/templates.js');

class entries {

    static getById(req, res, next) {
        entriesController.getById(req.params.id).then(result => {
            templates.process(req, res, 'entries/id', result);
        }).catch(next);
    }

    static getByCategory(req, res, next) {
        entriesController.getByCategory(req.params.category, req.params.value).then(result => {
            templates.process(req, res, 'entries/category', result);
        }).catch(next);
    }

    static getByTag(req, res, next) {
        entriesController.getByTag(req.params.tag).then(result => {
            templates.process(req, res, 'entries/tag', result);
        }).catch(next);
    }

    static search(req, res, next) {
        const params = req.body;

        entriesController.search(req.query.q).then(result => {
            templates.process(req, res, 'entries/search', result);
        }).catch(next);
    }
}

module.exports = entries;