'use strict';

class validation {
    isBoolean(value) {
        if (value === true || value === 'true' || value === 1 || value === '1' ||
            value === false || value === 'false' || value === 0 || value === '0') {
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

    isDefined(...params) {
        for (let param in params) {
            if (params[param] === undefined || params[param] === null) {
                return false;
            }
        }

        return true;
    }
}

module.exports = new validation();
