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
    login(email, password, details) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(email, password) || !validator.isEmail(email) || validator.isNull(password)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const userRecord = yield dataLayer.models.userModel.getSingleByEmail(email);

            if (userRecord === null || !security.bcryptCompare(password, userRecord.password)) {
                throw new apiServer.protocolException(errors.userOrPasswordMismatch);
            }

            const sessionRecord = yield shared.createSession(userRecord, details);

            return {
                sessionId: sessionRecord._id,
                refreshToken: sessionRecord.refreshToken,
                accessToken: sessionRecord.accessToken,
                accessTokenExpiresAt: sessionRecord.accessTokenExpiresAt,

                user: shared.userViewMutator(userRecord, true)
            };
        })();
    }

    refresh(sessionId, refreshToken) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(sessionId, refreshToken) || !validator.isMongoId(sessionId) || !validator.isUUID(refreshToken, 4)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const newAccessToken = uuid.v4(),
                  newAccessTokenExpiresAt = Date.now() + apiServer.config.tokens.accessTokenTtl;

            const sessionRecord = yield dataLayer.models.sessionModel.getSingleByIdAndRefreshToken(sessionId, security.sha1(refreshToken));

            if (sessionRecord === null) {
                throw new apiServer.protocolException(errors.sessionIdOrRefreshTokenMismatch);
            }

            const updatedSessionRecord = yield dataLayer.models.sessionModel.updateSingleById(sessionRecord._id, {
                $set: {
                    accessToken: security.sha1(newAccessToken),
                    accessTokenExpiresAt: newAccessTokenExpiresAt
                }
            });

            return {
                accessToken: newAccessToken,
                accessTokenExpiresAt: new Date(newAccessTokenExpiresAt)
            };
        })();
    }

    getSession(sessionId, accessToken) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(sessionId, accessToken) || !validator.isMongoId(sessionId) || !validator.isUUID(accessToken, 4)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const sha1key = security.sha1(accessToken);

            const sessionRecord = yield dataLayer.models.sessionModel.getSingleByIdAndAccessToken(sessionId, sha1key);

            if (sessionRecord === null) {
                return null;
            }

            return {
                sessionId: sessionRecord._id,
                userId: sessionRecord._user,
                userRoles: sessionRecord.userRoles
            };
        })();
    }

    logout(sessionId) {
        return _asyncToGenerator(function* () {
            if (!validation.isDefined(sessionId) || !validator.isMongoId(sessionId)) {
                throw new apiServer.protocolException(errors.malformedRequest);
            }

            const session = yield dataLayer.models.sessionModel.updateSingleById(sessionId, {
                $set: {
                    terminatedAt: Date.now()
                }
            });

            if (session === null) {
                throw new apiServer.protocolException(errors.sessionIdOrAccessTokenMismatch);
            }
        })();
    }
}

module.exports = new auth();