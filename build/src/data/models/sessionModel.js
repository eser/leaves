/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const dataLayer = require('../'),
      sessionSchema = require('../schemas/sessionSchema.js');

class sessionModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Sessions', sessionSchema);
    }

    // --- get methods
    getSingleByIdAndRefreshToken(id, refreshToken) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const sessionRecord = yield _this.model.where({
                _id: id,
                refreshToken: refreshToken,
                terminatedAt: undefined
            }).lean().findOne().exec();

            return sessionRecord;
        })();
    }

    getSingleByIdAndAccessToken(id, accessToken) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const sessionRecord = yield _this2.model.where({
                _id: id,
                accessToken: accessToken,
                $or: [{ accessTokenExpiresAt: { $gte: Date.now() } }, { accessTokenExpiresAt: undefined }],
                terminatedAt: undefined
            })
            // .populate('_user')
            .lean().findOne().exec();

            return sessionRecord;
        })();
    }

    // --- insert methods
    insert(data) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const model = new _this3.model(data);

            const insertedSessionRecord = yield model.save();

            return insertedSessionRecord;
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
}

module.exports = new sessionModel();