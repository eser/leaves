/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const dataLayer = require('../'),
      notificationSchema = require('../schemas/notificationSchema.js');

class notificationModel {
    constructor() {
        this.model = dataLayer.mongodb.model('Notifications', notificationSchema);
    }

    // --- get methods
    getSingleById(id) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const notificationRecord = yield _this.model.where({
                _id: id
            }).lean().findOne().exec();

            return notificationRecord;
        })();
    }

    get() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const query = _this2.model.where({
                isAvailable: true
            });

            const notificationRecords = yield query.lean().find().exec();

            return notificationRecords;
        })();
    }

    // --- aggregate methods
    aggrCount(lastNotificationSeen) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const whereCondition = {
                isAvailable: true
            };

            if (lastNotificationSeen) {
                whereCondition._id = { $gt: lastNotificationSeen };
            }

            const notificationRecordCount = yield _this3.model.where(whereCondition).count().exec();

            return notificationRecordCount;
        })();
    }

    // --- insert methods
    add(title, briefImage, briefText, fullImage, fullMessage) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            return yield _this4.insert({
                createdAt: new Date(),
                isAvailable: true,

                title: title,

                briefImage: briefImage,
                briefMessage: briefMessage,

                fullImage: fullImage,
                fullMessage: fullMessage
            });
        })();
    }

    insert(data) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const model = new _this5.model(data);

            const notificationRecord = yield model.save();

            return notificationRecord;
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

module.exports = new notificationModel();