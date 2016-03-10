'use strict';

var fs = require('fs'),
    marked = require('marked'),
    path = require('path');

module.exports = function($$resolver) {
    var base = path.resolve(__dirname, '..', 'posts'),
        posts = fs
            .readdirSync(base)
            .filter(function(name) {
                return name.indexOf('.md') === name.length - 3;
            })
            .reduce(function(posts, name) {
                var slug = name.replace(/\.md$/, ''),
                    raw = fs
                        .readFileSync(path.resolve(base, name))
                        .toString();

                posts[slug] = {
                    title: slug,
                    slug: slug,
                    body: marked(raw),
                };

                return posts;
            }, {});

    $$resolver.add('posts', posts);
};
