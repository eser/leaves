/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

class validation {
    isBoolean(value) {
        if (value === true || value === 'true' || value === 1 || value === '1' || value === false || value === 'false' || value === 0 || value === '0') {
            return true;
        }

        return false;
    }

    isTrue(value) {
        if (value === true || value === 'true' || value === 1 || value === '1') {
            return true;
        }

        return false;
    }

    isDefined() {
        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        for (let param in params) {
            if (params[param] === undefined || params[param] === null) {
                return false;
            }
        }

        return true;
    }
}

module.exports = new validation();