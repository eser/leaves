/**
 * leaves
 *
 * @version v0.9.0
 * @link https://leaves.io
 */
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs'),
      path = require('path'),
      ejs = require('ejs');

class templates {
    static process(req, res, template, data) {
        var _this = this;

        return _asyncToGenerator(function* () {

            if (req.params.format === 'json') {
                res.json(data);

                return;
            }

            try {
                const output = yield _this.getFile(`${ template }.${ req.params.format }.ejs`, data);

                res.send(output);
            } catch (ex) {
                res.json({
                    issue: 'format_not_supported'
                });
            }
        })();
    }

    static getFile(filepath, data) {
        return new Promise((resolve, reject) => {
            const filepath2 = path.join(__dirname, '../../etc/templates/', filepath);

            fs.readFile(filepath2, 'utf8', (err, content) => {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(this.get(content, data));
            });
        });
    }

    static get(template, data) {
        const options = {};

        return ejs.render(template, { model: data }, options);
    }
}

module.exports = templates;