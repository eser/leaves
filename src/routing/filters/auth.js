'use strict';

const apiServer = require('hex-api-server'),
    authController = require('../../controllers/auth.js');

const errors = {
    sessionIdOrAccessTokenMismatch: { status: 401, message: 'session_id_or_access_token_mismatch' }
};

class authFilter {
    static async checkSession(sessionId, accessToken) {
        const session = await authController.getSession(sessionId, accessToken);

        if (session === null) {
            throw new apiServer.protocolException(errors.sessionIdOrAccessTokenMismatch);
        }

        return session;
    }

    static isAuthenticated(req, res, next) {
        const sessionId = req.get('sessionId'),
            accessToken = req.get('accessToken');

        authFilter.checkSession(sessionId, accessToken)
            .then((result) => {
                req.sessionId = result.sessionId;
                req.userId = result.userId;
                req.userRoles = result.userRoles;

                next();
            })
            .catch(next);
    }
}

module.exports = authFilter;
