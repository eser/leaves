/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const dataLayer = require('../'),
      entrySchema = require('../schemas/entrySchema.js');

class entryModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Entries', entrySchema);
    }

    // --- get methods
    getSingleById(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const entryRecord = yield _this.model.where({
                _id: id
            }).lean().findOne().exec();

            return entryRecord;
        })();
    }

    getByProperty(property, value) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const entryRecords = yield _this2.model.where({
                [`properties.${ property }`]: value
            }).sort({ entry: 'asc' }).lean().find().exec();

            return entryRecords;
        })();
    }

    getByTag(tag) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const entryRecords = yield _this3.model.where({
                tags: tag
            }).sort({ entry: 'asc' }).lean().find().exec();

            return entryRecords;
        })();
    }

    // --- query methods
    search(queryText) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const entryRecords = yield _this4.model.find({ $text: { $search: queryText } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).lean().exec();

            return entryRecords;
        })();
    }

    // --- insert methods
    insert(data) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const model = new _this5.model(data);

            const insertedEntryRecord = yield model.save();

            return insertedEntryRecord;
        })();
    }

    // --- update methods
    updateSingleById(id, data) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const result = yield _this6.model.findOneAndUpdate({
                _id: id
            }, data, {
                'new': true
            }).lean();

            return result;
        })();
    }
}

module.exports = new entryModel();