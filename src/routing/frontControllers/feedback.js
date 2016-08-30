'use strict';

const feedbackController = require('../../controllers/feedback.js');

class feedback {

    static index(req, res, next) {
        const params = req.body;

        feedbackController.post(req.userId, req.sessionId, {
            subject: params.subject,
            message: params.message
        })
            .then((result) => {
                // res.json(result);
                res.json({});
            })
            .catch(next);
    }

}

module.exports = feedback;
