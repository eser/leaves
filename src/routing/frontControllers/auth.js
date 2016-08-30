'use strict';

const authController = require('../../controllers/auth.js');

class auth {

    static check(req, res, next) {
        // res.status(200).end();
        res.json({});
    }

    static login(req, res, next) {
        const params = req.body;

        authController.login(params.email, params.password, params.details)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static logout(req, res, next) {
        authController.logout(req.sessionId, req.sessionId)
            .then(() => {
                // res.status(200)
                //     .end();
                res.json({});
            })
            .catch(next);
    }

    static refresh(req, res, next) {
        const params = req.body;

        authController.refresh(params.sessionId, params.refreshToken)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

}

module.exports = auth;
