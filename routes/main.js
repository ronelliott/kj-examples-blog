'use strict';

var path = require('path');

module.exports = function($$app, url) {
    $$app.get(url('/static/:asset(.+)'), {
        handler: '$directory',
        base: path.resolve(__dirname, '..', 'public')
    });

    $$app.get(url('/post/:slug(.+)'), {
        handler: '$view',
        template: 'post',
        context: function($$resolver, $params) {
            return {
                post: $$resolver('posts')[$params.slug],
            };
        }
    });

    $$app.get(url('/'), {
        handler: '$view',
        template: 'posts',
        context: [
            'posts'
        ]
    });
};
