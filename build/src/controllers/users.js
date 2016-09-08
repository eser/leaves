/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const validator = require('validator'),
      uuid = require('node-uuid'),
      apiServer = require('hex-api-server'),
      dataLayer = require('../data/'),
      validation = require('../utils/validation.js'),
      shared = require('./shared.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' },
    targetUserNotAvailable: { status: 404, message: 'target_user_not_available' },
    confirmationCodeNotAvailable: { status: 404, message: 'confirmation_code_not_available' }
};

class users {
    register(userData, details) {
        return _asyncToGenerator(function* () {
            const createResult = yield shared.createUser({
                roles: [],
                email: userData.email,
                emailVerified: false,
                password: userData.password,

                firstname: userData.firstname,
                lastname: userData.lastname,
                gender: userData.gender || dataLayer.repositories.userRepository.genderValues.UNSPECIFIED,
                birthDate: userData.birthDate,
                phone: userData.phone,
                phoneVerified: false,
                profilePhoto: userData.profilePhoto,

                extra: validation.isDefined(userData.extra) && userData.extra.constructor === Object ? userData.extra : {}
            });

            // todo replace this dependency w/ model's itself
            const sessionRecord = yield shared.createSession(createResult.user, details);

            return {
                sessionId: sessionRecord.sessionId,
                refreshToken: sessionRecord.refreshToken,
                accessToken: sessionRecord.accessToken,
                accessTokenExpiresAt: sessionRecord.accessTokenExpiresAt,

                user: shared.userViewMutator(createResult.user, true)
            };
        })();
    }

    getInvitationCode(sessionId, userId) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(sessionId, userId) || !validator.isMongoId(userId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            let invitationRecord = yield dataLayer.repositories.invitationRepository.getFirstAvailableByUser(userId);

            if (invitationRecord === null) {
                invitationRecord = yield dataLayer.repositories.invitationRepository.insert({
                    _session: sessionId,
                    _user: userId,

                    code: uuid.v4(),
                    isUsed: false
                });
            }

            return {
                invitationCode: invitationRecord.code
            };
        })();
    }

    profileById(targetUserId, isMine) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(targetUserId) || !validator.isMongoId(targetUserId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const userRecord = yield dataLayer.repositories.userRepository.getSingleById(targetUserId);

            if (userRecord === null) {
                throw new apiServer.protocolException(errors.targetUserNotAvailable);
            }

            return {
                user: shared.userViewMutator(userRecord, isMine)
            };
        })();
    }

    profileByEmail(targetEmail, isMine) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(targetEmail) || !validator.isAlphanumeric(targetEmail)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const userRecord = yield dataLayer.repositories.userRepository.getSingleByEmail(targetEmail);

            if (userRecord === null) {
                throw new apiServer.protocolException(errors.targetUserNotAvailable);
            }

            return {
                user: shared.userViewMutator(userRecord, isMine)
            };
        })();
    }

    confirmEmail(targetUserId, code) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(targetUserId, code) || !validator.isMongoId(targetUserId) || !validator.isUUID(code, 4)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const confirmationRecord = yield dataLayer.repositories.confirmationRepository.getSingleByTypeAndCode(targetUserId, dataLayer.repositories.confirmationRepository.typeValues.EMAIL_ADDRESS, code);

            if (confirmationRecord === null) {
                throw new apiServer.protocolException(errors.confirmationCodeNotAvailable);
            }

            // type and code check
            const updatedRecord = yield dataLayer.repositories.userRepository.updateSingleById(targetUserId, {
                $set: {
                    emailVerified: true
                }
            });

            yield dataLayer.repositories.confirmationRepository.updateSingleById(confirmationRecord._id, {
                $set: {
                    confirmedAt: Date.now()
                }
            });

            return {
                user: shared.userViewMutator(updatedRecord, true)
            };
        })();
    }

    confirmPhone(targetUserId, code) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(targetUserId, code) || !validator.isMongoId(targetUserId) || !validator.isUUID(code, 4)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const confirmationRecord = yield dataLayer.repositories.confirmationRepository.getSingleByTypeAndCode(targetUserId, dataLayer.repositories.confirmationRepository.typeValues.PHONE_NUMBER, code);

            if (confirmationRecord === null) {
                throw new apiServer.protocolException(errors.confirmationCodeNotAvailable);
            }

            // type and code check
            const updatedRecord = yield dataLayer.repositories.userRepository.updateSingleById(targetUserId, {
                $set: {
                    phoneVerified: true
                }
            });

            yield dataLayer.repositories.confirmationRepository.updateSingleById(confirmationRecord._id, {
                $set: {
                    confirmedAt: Date.now()
                }
            });

            return {
                user: shared.userViewMutator(updatedRecord, true)
            };
        })();
    }

    update(targetUserId, userData) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(targetUserId, userData) || !validator.isMongoId(targetUserId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const fields = {};

            if (validation.isDefined(userData.email)) {
                if (!validator.isEmail(userData.email)) {
                    throw new apiServer.protocolException(errors.malformedRequest);
                }

                fields.email = userData.email;

                if (userData.roles === undefined || userData.roles.indexOf('admin') === -1) {
                    fields.emailVerified = false;
                }
            }

            if (validation.isDefined(userData.password)) {
                if (validator.isNull(userData.password)) {
                    throw new apiServer.protocolException(errors.malformedRequest);
                }

                fields.password = userData.password;
            }

            if (validation.isDefined(userData.firstname)) {
                if (validator.isNull(userData.firstname)) {
                    throw new apiServer.protocolException(errors.malformedRequest);
                }

                fields.firstname = userData.firstname;
            }

            if (validation.isDefined(userData.lastname)) {
                if (validator.isNull(userData.lastname)) {
                    throw new apiServer.protocolException(errors.malformedRequest);
                }

                fields.lastname = userData.lastname;
            }

            if (validation.isDefined(userData.gender)) {
                fields.gender = userData.gender;
            }

            if (validation.isDefined(userData.birthDate)) {
                fields.birthDate = userData.birthDate;
            }

            if (validation.isDefined(userData.phone)) {
                fields.phone = userData.phone;

                if (userData.roles === undefined || userData.roles.indexOf('admin') === -1) {
                    fields.phoneVerified = false;
                }
            }

            if (validation.isDefined(userData.profilePhoto)) {
                const profilePhotoFile = yield shared.s3WriteFile(uuid.v4(), userData.profilePhotoMimetype, userData.profilePhoto);

                // fields.profilePhoto = resources.convertToCdn(apiServer.config.aws, profilePhotoFile.resourceUrl);
                fields.profilePhoto = profilePhotoFile.resourceUrl;
            }

            if (validation.isDefined(userData.extra) && userData.extra.constructor === Object) {
                for (let extraKey in userData.extra) {
                    if (userData.hasOwnProperty(extraKey)) {
                        fields.extra[extraKey] = userData.extra[extraKey];
                    }
                }
            }

            const updatedRecord = yield dataLayer.repositories.userRepository.updateSingleById(targetUserId, {
                $set: fields
            });

            return {
                user: shared.userViewMutator(updatedRecord, true)
            };
        })();
    }
}

module.exports = new users();