/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

const crypto = require('crypto'),
      bcrypt = require('bcryptjs');

class security {
    static get sha1DefaultSalt() {
        return 'salt-salt';
    }

    static get bcryptRotateCount() {
        return 10;
    }

    static sha1(input) {
        const shasum = crypto.createHash('sha1');

        shasum.update(input + this.sha1DefaultSalt);

        return shasum.digest('hex');
    }

    static bcryptCompare(a, b) {
        return bcrypt.compareSync(a, b);
    }

    static bcrypt(input) {
        const salt = bcrypt.genSaltSync(this.bcryptRotateCount);

        return bcrypt.hashSync(input, salt);
    }
}

module.exports = security;