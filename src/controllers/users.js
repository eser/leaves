'use strict';

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
    async register(userData, details) {
        const createResult = await shared.createUser({
            roles: [],
            email: userData.email,
            emailVerified: false,
            password: userData.password,

            firstname: userData.firstname,
            lastname: userData.lastname,
            gender: userData.gender || dataLayer.models.userModel.genderValues.UNSPECIFIED,
            birthDate: userData.birthDate,
            phone: userData.phone,
            phoneVerified: false,
            profilePhoto: userData.profilePhoto,

            extra: (validation.isDefined(userData.extra) && userData.extra.constructor === Object) ? userData.extra : {}
        });

        // todo replace this dependency w/ model's itself
        const sessionRecord = await shared.createSession(createResult.user, details);

        return {
            sessionId: sessionRecord.sessionId,
            refreshToken: sessionRecord.refreshToken,
            accessToken: sessionRecord.accessToken,
            accessTokenExpiresAt: sessionRecord.accessTokenExpiresAt,

            user: shared.userViewMutator(createResult.user, true)
        };
    }

    async getInvitationCode(sessionId, userId) {
        if (!validation.isDefined(sessionId, userId) ||
            !validator.isMongoId(userId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        let invitationRecord = await dataLayer.models.invitationModel.getFirstAvailableByUser(userId);

        if (invitationRecord === null) {
            invitationRecord = await dataLayer.models.invitationModel.insert({
                _session: sessionId,
                _user: userId,

                code: uuid.v4(),
                isUsed: false
            });
        }

        return {
            invitationCode: invitationRecord.code
        };
    }

    async profileById(targetUserId, isMine) {
        if (!validation.isDefined(targetUserId) ||
            !validator.isMongoId(targetUserId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const userRecord = await dataLayer.models.userModel.getSingleById(targetUserId);

        if (userRecord === null) {
            throw new apiServer.protocolException(errors.targetUserNotAvailable);
        }

        return {
            user: shared.userViewMutator(userRecord, isMine)
        };
    }

    async profileByEmail(targetEmail, isMine) {
        if (!validation.isDefined(targetEmail) ||
            !validator.isAlphanumeric(targetEmail)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const userRecord = await dataLayer.models.userModel.getSingleByEmail(targetEmail);

        if (userRecord === null) {
            throw new apiServer.protocolException(errors.targetUserNotAvailable);
        }

        return {
            user: shared.userViewMutator(userRecord, isMine)
        };
    }

    async confirmEmail(targetUserId, code) {
        if (!validation.isDefined(targetUserId, code) ||
            !validator.isMongoId(targetUserId) ||
            !validator.isUUID(code, 4)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const confirmationRecord = await dataLayer.models.confirmationModel.getSingleByTypeAndCode(
                targetUserId,
                dataLayer.models.confirmationModel.typeValues.EMAIL_ADDRESS,
                code
            );

        if (confirmationRecord === null) {
            throw new apiServer.protocolException(errors.confirmationCodeNotAvailable);
        }

        // type and code check
        const updatedRecord = await dataLayer.models.userModel.updateSingleById(
            targetUserId,
            {
                $set: {
                    emailVerified: true
                }
            }
        );

        await dataLayer.models.confirmationModel.updateSingleById(
            confirmationRecord._id,
            {
                $set: {
                    confirmedAt: Date.now()
                }
            }
        );

        return {
            user: shared.userViewMutator(updatedRecord, true)
        };
    }

    async confirmPhone(targetUserId, code) {
        if (!validation.isDefined(targetUserId, code) ||
            !validator.isMongoId(targetUserId) ||
            !validator.isUUID(code, 4)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const confirmationRecord = await dataLayer.models.confirmationModel.getSingleByTypeAndCode(
                targetUserId,
                dataLayer.models.confirmationModel.typeValues.PHONE_NUMBER,
                code
            );

        if (confirmationRecord === null) {
            throw new apiServer.protocolException(errors.confirmationCodeNotAvailable);
        }

        // type and code check
        const updatedRecord = await dataLayer.models.userModel.updateSingleById(
            targetUserId,
            {
                $set: {
                    phoneVerified: true
                }
            }
        );

        await dataLayer.models.confirmationModel.updateSingleById(
            confirmationRecord._id,
            {
                $set: {
                    confirmedAt: Date.now()
                }
            }
        );

        return {
            user: shared.userViewMutator(updatedRecord, true)
        };
    }

    async update(targetUserId, userData) {
        if (!validation.isDefined(targetUserId, userData) ||
            !validator.isMongoId(targetUserId)) {
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
            const profilePhotoFile = await shared.s3WriteFile(
                    uuid.v4(),
                    userData.profilePhotoMimetype,
                    userData.profilePhoto
                );

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

        const updatedRecord = await dataLayer.models.userModel.updateSingleById(
            targetUserId,
            {
                $set: fields
            }
        );

        return {
            user: shared.userViewMutator(updatedRecord, true)
        };
    }
}

module.exports = new users();
