/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const pagesController = require('../../controllers/pages.js'),
      templates = require('../../utils/templates.js');

class pages {

    static getById(req, res, next) {
        pagesController.getById(req.params.id).then(result => {
            templates.process(req, res, 'pages/id', result);
        }).catch(next);
    }

    static getByName(req, res, next) {
        pagesController.getByName(req.params.name).then(result => {
            templates.process(req, res, 'pages/id', result);
        }).catch(next);
    }

    static getAll(req, res, next) {
        pagesController.getAll().then(result => {
            templates.process(req, res, 'pages/all', result);
        }).catch(next);
    }

    static search(req, res, next) {
        pagesController.search(req.query.q).then(result => {
            templates.process(req, res, 'pages/search', result);
        }).catch(next);
    }
}

module.exports = pages;