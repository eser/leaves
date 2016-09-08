/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const dataLayer = require('../'),
      feedbackSchema = require('../schemas/feedbackSchema.js');

class feedbackModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Feedbacks', feedbackSchema);
    }

    // --- get methods
    getSingleById(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const feedbackRecord = yield _this.model.where({
                _id: id
            }).lean().findOne().exec();

            return feedbackRecord;
        })();
    }

    // --- insert methods
    insert(data) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const model = new _this2.model(data);

            const feedbackRecord = yield model.save();

            return feedbackRecord;
        })();
    }

    // --- remove methods
    removeSingleById(id) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const result = yield _this3.model.findOneAndRemove({
                _id: id
            }).exec();

            return result;
        })();
    }
}

module.exports = new feedbackModel();