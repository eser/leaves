'use strict';

module.exports = (router, apiServer) => {

    router.addCors();

    router.addStatic(`${apiServer.options.dir}/public`);

    router.add((r, frontControllers, filters) => {

        // index
        r.route('/healthCheck.:format')
            .get(frontControllers.index.healthCheck);

        // entries
        r.route('/entries/id/:id.:format')
            .get(frontControllers.entries.getById);

        r.route('/entries/category/:category/:value.:format')
            .get(frontControllers.entries.getByCategory);

        r.route('/entries/tag/:tag.:format')
            .get(frontControllers.entries.getByTag);

        r.route('/entries/search.:format')
            .get(frontControllers.entries.search);

        // entries
        r.route('/pages/id/:id.:format')
            .get(frontControllers.pages.getById);

        r.route('/pages/name/:name.:format')
            .get(frontControllers.pages.getByName);

        r.route('/pages/index.:format')
            .get(frontControllers.pages.getAll);

        r.route('/pages/search.:format')
            .get(frontControllers.pages.search);

    });

};
