/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const validator = require('validator'),
      phone = require('phone'),
      uuid = require('node-uuid'),
      apiServer = require('hex-api-server'),
      dataLayer = require('../data/'),
      security = require('../utils/security.js'),
      validation = require('../utils/validation.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' },
    invitationCodeNotAvailable: { status: 404, message: 'invitation_code_not_available' },
    emailIsAlreadyRegistered: { status: 500, message: 'email_is_already_registered' },
    phoneIsAlreadyRegistered: { status: 500, message: 'phone_is_already_registered' },
    exception: { status: 500, message: 'exception' }
};

class shared {
    constructor() {
        // this.charWhitelist = 'abcdefghijklmnopqrstuvwxyz-';
    }

    createUser(userData) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (!validation.isDefined(userData.phone)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const phoneNumber = phone(userData.phone, 'TUR');

            if (!validation.isDefined(userData.email, userData.password) || !validator.isEmail(userData.email) || validator.isNull(userData.password) ||
            // validator.isNull(userData.firstname) ||
            // validator.isNull(userData.lastname) ||
            // validator.isNull(userData.gender) ||
            // !validator.isDate(userData.birthDate) ||
            phoneNumber.length === 0 // ||
            // (userData.profilePhoto !== undefined && !validator.isURL(userData.profilePhoto))
            ) {
                    throw new apiServer.protocolException(errors.malformedRequest);
                }

            const userEmailCheck = yield dataLayer.repositories.userRepository.getSingleByEmail(userData.email);

            if (userEmailCheck !== null) {
                throw new apiServer.protocolException(errors.emailIsAlreadyRegistered);
            }

            const userPhoneCheck = yield dataLayer.repositories.userRepository.getSingleByPhone(phoneNumber[0]);

            if (userPhoneCheck !== null) {
                throw new apiServer.protocolException(errors.phoneIsAlreadyRegistered);
            }

            let invitationRecord;

            if (validation.isDefined(userData.invitationCode)) {
                if (!validator.isUUID(userData.invitationCode, 4)) {
                    throw new apiServer.protocolException(errors.malformedRequest);
                }

                invitationRecord = yield dataLayer.repositories.invitationRepository.getSingleByCode(userData.invitationCode);

                if (invitationRecord === null) {
                    throw new apiServer.protocolException(errors.invitationCodeNotAvailable);
                }
            }

            let profilePhoto;

            if (validation.isDefined(userData.profilePhoto)) {
                const profilePhotoFile = yield _this.s3WriteFile(uuid.v4(), userData.profilePhotoMimetype, userData.profilePhoto);

                profilePhoto = profilePhotoFile.resourceUrl;
            }

            const userRecord = {
                roles: userData.roles,
                email: userData.email,
                emailVerified: userData.emailVerified,
                password: security.bcrypt(userData.password),

                firstname: userData.firstname,
                lastname: userData.lastname,
                gender: userData.gender,
                birthDate: userData.birthDate,
                phone: phoneNumber[0],
                phoneVerified: userData.phoneVerified,
                profilePhoto: profilePhoto,
                createdAt: Date.now(),
                _invitedBy: invitationRecord !== undefined ? invitationRecord._user : undefined,

                extra: userData.extra,

                settings: {
                    // language: undefined,
                    pushNotifications: true
                }
            };

            const insertedRecord = yield dataLayer.repositories.userRepository.insert(userRecord);

            if (invitationRecord !== undefined) {
                yield dataLayer.repositories.invitationRepository.updateSingleById(invitationRecord._id, {
                    $set: {
                        isUsed: true
                    }
                });
            }

            return {
                user: insertedRecord
            };
        })();
    }

    createSession(user, details) {
        return _asyncToGenerator(function* () {
            let detailsObject;

            if (details !== undefined && details !== null && details.constructor === Object) {
                detailsObject = details;
            } else {
                detailsObject = {};
            }

            const refreshToken = uuid.v4(),
                  accessToken = uuid.v4(),
                  accessTokenExpiresAt = Date.now() + apiServer.config.tokens.accessTokenTtl,
                  sessionData = {
                _user: user._id,
                userRoles: user.roles,

                accessToken: security.sha1(accessToken),
                accessTokenExpiresAt: accessTokenExpiresAt,
                refreshToken: security.sha1(refreshToken),
                createdAt: Date.now(),
                // terminatedAt: undefined,

                details: {
                    remoteAddr: detailsObject.remote_addr || '',
                    userAgent: detailsObject.user_agent || '',
                    deviceId: detailsObject.device_id || ''
                }
            };

            const insertedSessionRecord = yield dataLayer.repositories.sessionRepository.insert(sessionData);

            return {
                sessionId: insertedSessionRecord._id,
                refreshToken: refreshToken,
                accessToken: accessToken,
                accessTokenExpiresAt: new Date(accessTokenExpiresAt)
            };
        })();
    }

    userViewMutator(userRecord, isMine) {
        if (userRecord === null || userRecord === undefined) {
            return userRecord;
        }

        const userMutated = {
            _id: userRecord._id,
            roles: userRecord.roles,
            email: isMine ? userRecord.email : undefined,
            emailVerified: userRecord.emailVerified,

            firstname: userRecord.firstname,
            lastname: userRecord.lastname,
            gender: userRecord.gender,
            birthDate: userRecord.birthDate,
            phone: userRecord.phone,
            phoneVerified: userRecord.phoneVerified,
            profilePhoto: userRecord.profilePhoto,
            createdAt: userRecord.createdAt,

            extra: isMine ? userRecord.extra : undefined,

            settings: isMine ? userRecord.settings : undefined
        };

        return userMutated;
    }
}

module.exports = new shared();