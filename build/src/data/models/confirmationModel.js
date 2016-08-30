/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const dataLayer = require('../'),
      confirmationSchema = require('../schemas/confirmationSchema.js');

class confirmationModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Confirmations', confirmationSchema);

        // --- enums
        this.typeValues = {
            EMAIL_ADDRESS: 1,
            PHONE_NUMBER: 2
        };
    }

    // --- get methods
    getSingleById(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const confirmationRecord = yield _this.model.where({
                _id: id
            }).lean().findOne().exec();

            return confirmationRecord;
        })();
    }

    getSingleByTypeAndCode(userId, type, code) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const confirmationRecord = yield _this2.model.where({
                _user: userId,
                type: type,
                code: code,
                confirmedAt: undefined
            }).lean().findOne().exec();

            return confirmationRecord;
        })();
    }

    // --- insert methods
    insert(data) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const model = new _this3.model(data);

            const confirmationRecord = yield model.save();

            return confirmationRecord;
        })();
    }

    // --- update methods
    updateSingleById(id, data) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const result = yield _this4.model.findOneAndUpdate({
                _id: id
            }, data, {
                'new': true
            }).lean();

            return result;
        })();
    }

    // --- remove methods
    removeSingleById(id) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const result = yield _this5.model.findOneAndRemove({
                _id: id
            }).exec();

            return result;
        })();
    }
}

module.exports = new confirmationModel();