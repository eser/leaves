/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const notificationsController = require('../../controllers/notifications.js');

class notifications {

    static index(req, res, next) {
        notificationsController.get(req.userId).then(result => {
            res.json(result);
        }).catch(next);
    }

    static count(req, res, next) {
        notificationsController.getUnreadCount(req.userId).then(result => {
            res.json(result);
        }).catch(next);
    }

    static update(req, res, next) {
        notificationsController.updateSeenAt(req.userId, req.body.lastNotificationId).then(() => {
            // res.status(200)
            //     .end();
            res.json({});
        }).catch(next);
    }

}

module.exports = notifications;