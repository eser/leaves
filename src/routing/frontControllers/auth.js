'use strict';

const authController = require('../../controllers/auth.js');

class auth {

    static check(req, res, next) {
        // res.status(200).end();
        res.json({});
    }

    static login(req, res, next) {
        authController.login(req.body.email, req.body.password, req.body.details)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static logout(req, res, next) {
        authController.logout(req.sessionId)
            .then(() => {
                // res.status(200)
                //     .end();
                res.json({});
            })
            .catch(next);
    }

    static refresh(req, res, next) {
        authController.refresh(req.get('sessionId'), req.get('refreshToken'))
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

}

module.exports = auth;
