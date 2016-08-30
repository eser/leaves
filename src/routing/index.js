'use strict';

module.exports = (router, apiServer) => {

    router.addCors();

    router.addStatic(`${apiServer.options.dir}/public`);

    router.add((r, frontControllers, filters) => {

        // index
        r.route('/healthCheck.:format')
            .get(frontControllers.index.healthCheck);

        // auth
        r.route('/auth/check')
            .post(filters.auth.isAuthenticated, frontControllers.auth.check);

        r.route('/auth/login')
            .post(frontControllers.auth.login);

        r.route('/auth/logout')
            .post(filters.auth.isAuthenticated, frontControllers.auth.logout);

        r.route('/auth/refresh')
            .post(frontControllers.auth.refresh);

        // entries
        r.route('/entries/ids/:id.:format')
            .get(frontControllers.entries.getById);

        r.route('/entries/properties/:property/:value.:format')
            .get(frontControllers.entries.getByProperty);

        r.route('/entries/tags/:tag.:format')
            .get(frontControllers.entries.getByTag);

        r.route('/entries/search.:format')
            .get(frontControllers.entries.search);

        // entries
        r.route('/pages/ids/:id.:format')
            .get(frontControllers.pages.getById);

        r.route('/pages/names/:name.:format')
            .get(frontControllers.pages.getByName);

        r.route('/pages/index.:format')
            .get(frontControllers.pages.getAll);

        r.route('/pages/search.:format')
            .get(frontControllers.pages.search);

        // users
        r.route('/users/profile')
            .post(filters.auth.isAuthenticated, frontControllers.users.profile);

        r.route('/users/profileByEmail')
            .post(filters.auth.isAuthenticated, frontControllers.users.profileByEmail);

        r.route('/users/myProfile')
            .post(filters.auth.isAuthenticated, frontControllers.users.myProfile);

        r.route('/users/register')
            .post(frontControllers.users.register);

        r.route('/users/getInvitationCode')
            .post(filters.auth.isAuthenticated, frontControllers.users.getInvitationCode);

        r.route('/users/confirmEmail')
            .post(filters.auth.isAuthenticated, frontControllers.users.confirmEmail);

        r.route('/users/confirmPhone')
            .post(filters.auth.isAuthenticated, frontControllers.users.confirmPhone);

        r.route('/users/update')
            .post(filters.auth.isAuthenticated, frontControllers.users.update);

        // notifications
        r.route('/notifications')
            .post(filters.auth.isAuthenticated, frontControllers.notifications.index);

        r.route('/notifications/count')
            .post(filters.auth.isAuthenticated, frontControllers.notifications.count);

        r.route('/notifications/update')
            .post(filters.auth.isAuthenticated, frontControllers.notifications.update);

        // feedback
        r.route('/feedback')
            .post(filters.auth.isAuthenticated, frontControllers.feedback.index);

    });

};
