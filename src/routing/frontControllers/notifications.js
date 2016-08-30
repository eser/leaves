'use strict';

const notificationsController = require('../../controllers/notifications.js');

class notifications {

    static index(req, res, next) {
        const params = req.body;

        notificationsController.get(req.userId, { cursor: params.cursor, sort: params.sort, limit: params.limit })
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static count(req, res, next) {
        const params = req.body;

        notificationsController.getUnreadCount(req.userId)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static update(req, res, next) {
        const params = req.body;

        notificationsController.updateSeenAt(req.userId, params.lastNotificationId)
            .then(() => {
                // res.status(200)
                //     .end();
                res.json({});
            })
            .catch(next);
    }

}

module.exports = notifications;
