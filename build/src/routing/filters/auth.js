/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const apiServer = require('hex-api-server'),
      authController = require('../../controllers/auth.js');

const errors = {
    sessionIdOrAccessTokenMismatch: { status: 401, message: 'session_id_or_access_token_mismatch' }
};

class authFilter {
    static checkSession(sessionId, accessToken) {
        return _asyncToGenerator(function* () {
            const session = yield authController.getSession(sessionId, accessToken);

            if (session === null) {
                throw new apiServer.protocolException(errors.sessionIdOrAccessTokenMismatch);
            }

            return session;
        })();
    }

    static isAuthenticated(req, res, next) {
        const sessionId = req.get('sessionId'),
              accessToken = req.get('accessToken');

        authFilter.checkSession(sessionId, accessToken).then(result => {
            req.sessionId = result.sessionId;
            req.userId = result.userId;
            req.userRoles = result.userRoles;

            next();
        }).catch(next);
    }
}

module.exports = authFilter;