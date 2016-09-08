'use strict';

const validator = require('validator'),
    uuid = require('node-uuid'),
    apiServer = require('hex-api-server'),
    dataLayer = require('../data/'),
    security = require('../utils/security.js'),
    validation = require('../utils/validation.js'),
    shared = require('./shared.js');

const errors = {
    malformedRequest: { status: 400, message: 'malformed_request' },
    userOrPasswordMismatch: { status: 401, message: 'user_or_password_mismatch' },
    sessionIdOrAccessTokenMismatch: { status: 401, message: 'session_id_or_access_token_mismatch' },
    sessionIdOrRefreshTokenMismatch: { status: 401, message: 'session_id_or_refresh_token_mismatch' }
};

class auth {
    async login(email, password, details) {
        if (!validation.isDefined(email, password) ||
            !validator.isEmail(email) ||
            validator.isNull(password)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const userRecord = await dataLayer.repositories.userRepository.getSingleByEmail(email);

        if (userRecord === null ||
            !security.bcryptCompare(password, userRecord.password)) {
            throw new apiServer.protocolException(errors.userOrPasswordMismatch);
        }

        const sessionRecord = await shared.createSession(userRecord, details);

        return {
            sessionId: sessionRecord._id,
            refreshToken: sessionRecord.refreshToken,
            accessToken: sessionRecord.accessToken,
            accessTokenExpiresAt: sessionRecord.accessTokenExpiresAt,

            user: shared.userViewMutator(userRecord, true)
        };
    }

    async refresh(sessionId, refreshToken) {
        if (!validation.isDefined(sessionId, refreshToken) ||
            !validator.isMongoId(sessionId) ||
            !validator.isUUID(refreshToken, 4)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const newAccessToken = uuid.v4(),
            newAccessTokenExpiresAt = Date.now() + apiServer.config.tokens.accessTokenTtl;

        const sessionRecord = await dataLayer.repositories.sessionRepository.getSingleByIdAndRefreshToken(sessionId, security.sha1(refreshToken));

        if (sessionRecord === null) {
            throw new apiServer.protocolException(errors.sessionIdOrRefreshTokenMismatch);
        }

        const updatedSessionRecord = await dataLayer.repositories.sessionRepository.updateSingleById(
            sessionRecord._id,
            {
                $set: {
                    accessToken: security.sha1(newAccessToken),
                    accessTokenExpiresAt: newAccessTokenExpiresAt
                }
            }
        );

        return {
            accessToken: newAccessToken,
            accessTokenExpiresAt: new Date(newAccessTokenExpiresAt)
        };
    }

    async getSession(sessionId, accessToken) {
        if (!validation.isDefined(sessionId, accessToken) ||
            !validator.isMongoId(sessionId) ||
            !validator.isUUID(accessToken, 4)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const sha1key = security.sha1(accessToken);

        const sessionRecord = await dataLayer.repositories.sessionRepository.getSingleByIdAndAccessToken(sessionId, sha1key);

        if (sessionRecord === null) {
            return null;
        }

        return {
            sessionId: sessionRecord._id,
            userId: sessionRecord._user,
            userRoles: sessionRecord.userRoles
        };
    }

    async logout(sessionId) {
        if (!validation.isDefined(sessionId) ||
            !validator.isMongoId(sessionId)) {
            throw new apiServer.protocolException(errors.malformedRequest);
        }

        const session = await dataLayer.repositories.sessionRepository.updateSingleById(
            sessionId,
            {
                $set: {
                    terminatedAt: Date.now()
                }
            }
        );

        if (session === null) {
            throw new apiServer.protocolException(errors.sessionIdOrAccessTokenMismatch);
        }
    }
}

module.exports = new auth();
