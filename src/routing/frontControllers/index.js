'use strict';

class index {

    /**
     * @api {get} /healthCheck /healthCheck
     * @apiGroup Root
     * @apiName HealthCheck
     * @apiDescription Health Check
     * @apiPermission none
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    static healthCheck(req, res, next) {
        res.status(200)
            .end();
    }

}

module.exports = index;
