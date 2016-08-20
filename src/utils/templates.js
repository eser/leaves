'use strict';

const fs = require('fs'),
    path = require('path'),
    ejs = require('ejs');

class templates {
    static async process(req, res, template, data) {

        if (req.params.format === 'json') {
            res.json(data);

            return;
        }

        try {
            const output = await this.getFile(`${template}.${req.params.format}.ejs`, data);

            res.send(output);
        }
        catch (ex) {
            res.json({
                issue: 'format_not_supported'
            });
        }
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
