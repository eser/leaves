/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const dataLayer = require('../'),
      invitationSchema = require('../schemas/invitationSchema.js');

class invitationModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Invitations', invitationSchema);
    }

    // --- get methods
    getSingleById(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const invitationRecord = yield _this.model.where({
                _id: id
            }).lean().findOne().exec();

            return invitationRecord;
        })();
    }

    getSingleByCode(code) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const invitationRecord = yield _this2.model.where({
                code: code,
                isUsed: false
            })
            // .populate('_user')
            .lean().findOne().exec();

            return invitationRecord;
        })();
    }

    getFirstAvailableByUser(userId) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const invitationRecord = yield _this3.model.where({
                _user: userId,
                isUsed: false
            }).lean().findOne().exec();

            return invitationRecord;
        })();
    }

    // --- insert methods
    insert(data) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const model = new _this4.model(data);

            const invitationRecord = yield model.save();

            return invitationRecord;
        })();
    }

    // --- update methods
    updateSingleById(id, data) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const result = yield _this5.model.findOneAndUpdate({
                _id: id
            }, data, {
                'new': true
            }).lean();

            return result;
        })();
    }

    // --- remove methods
    removeSingleById(id) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const result = yield _this6.model.findOneAndRemove({
                _id: id
            }).exec();

            return result;
        })();
    }
}

module.exports = new invitationModel();