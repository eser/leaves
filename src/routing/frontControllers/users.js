'use strict';

const usersController = require('../../controllers/users.js');

class users {

    static profile(req, res, next) {
        const params = req.body;

        usersController.profileById(params.targetUserId, false)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static profileByEmail(req, res, next) {
        const params = req.body;

        usersController.profileByEmail(params.targetEmail, false)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static myProfile(req, res, next) {
        const params = req.body;

        usersController.profileById(req.userId, true)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static register(req, res, next) {
        const params = req.body;

        usersController.register({
            email: params.email,
            password: params.password,

            firstname: params.firstname,
            lastname: params.lastname,
            gender: params.gender,
            birthDate: params.birthDate,
            phone: params.phone,
            profilePhoto: params.profilePhoto,
            profilePhotoMimetype: params.profilePhotoMimetype,

            extra: params.extra,
            invitationCode: params.invitationCode
        })
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static getInvitationCode(req, res, next) {
        const params = req.body;

        usersController.getInvitationCode(req.sessionId, req.userId)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static confirmEmail(req, res, next) {
        const params = req.body;

        usersController.confirmEmail(req.userId, params.code)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static confirmPhone(req, res, next) {
        const params = req.body;

        usersController.confirmPhone(req.userId, params.code)
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

    static update(req, res, next) {
        const params = req.body;

        usersController.update(req.userId, {
            email: params.email,
            password: params.password,

            firstname: params.firstname,
            lastname: params.lastname,
            gender: params.gender,
            birthDate: params.birthDate,
            phone: params.phone,
            profilePhoto: params.profilePhoto,
            profilePhotoMimetype: params.profilePhotoMimetype,

            extra: params.extra
        })
            .then((result) => {
                res.json(result);
            })
            .catch(next);
    }

}

module.exports = users;
