/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const usersController = require('../../controllers/users.js');

class users {

    static profile(req, res, next) {
        usersController.profileById(req.params.id, false).then(result => {
            res.json(result);
        }).catch(next);
    }

    static profileByEmail(req, res, next) {
        usersController.profileByEmail(req.params.email, false).then(result => {
            res.json(result);
        }).catch(next);
    }

    static myProfile(req, res, next) {
        usersController.profileById(req.userId, true).then(result => {
            res.json(result);
        }).catch(next);
    }

    static register(req, res, next) {
        usersController.register({
            email: req.body.email,
            password: req.body.password,

            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            birthDate: req.body.birthDate,
            phone: req.body.phone,
            profilePhoto: req.body.profilePhoto,
            profilePhotoMimetype: req.body.profilePhotoMimetype,

            extra: req.body.extra,
            invitationCode: req.body.invitationCode
        }).then(result => {
            res.json(result);
        }).catch(next);
    }

    static getInvitationCode(req, res, next) {
        usersController.getInvitationCode(req.sessionId, req.userId).then(result => {
            res.json(result);
        }).catch(next);
    }

    static confirmEmail(req, res, next) {
        usersController.confirmEmail(req.userId, req.params.code).then(result => {
            res.json(result);
        }).catch(next);
    }

    static confirmPhone(req, res, next) {
        usersController.confirmPhone(req.userId, req.params.code).then(result => {
            res.json(result);
        }).catch(next);
    }

    static update(req, res, next) {
        usersController.update(req.userId, {
            email: req.body.email,
            password: req.body.password,

            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            birthDate: req.body.birthDate,
            phone: req.body.phone,
            profilePhoto: req.body.profilePhoto,
            profilePhotoMimetype: req.body.profilePhotoMimetype,

            extra: req.body.extra
        }).then(result => {
            res.json(result);
        }).catch(next);
    }

}

module.exports = users;