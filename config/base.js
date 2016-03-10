'use strict';

var path = require('path'),
    reflekt = require('reflekt');

function initializer(name) {
    return require(path.resolve(__dirname, '..', 'initializers', name));
}

function routes(name, base) {
    base = base || '';
    var mod = require(path.resolve(__dirname, '..', 'routes', name));

    return function($$caller, callback) {
        $$caller(mod, null, {
            callback: callback,
            url: function(sub) {
                return base + sub;
            }
        });

        !reflekt.has(mod, 'callback') && callback();
    };
}

module.exports = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    modules: [
        require('kj-handler-directory'),
        require('kj-renderer-nunjucks')({
            enabled: true,
            path: 'views',
        }),
        require('kj-handler-view'),
        require('kj-logger-winston')({
            loggers: {
                app: {
                    enabled: true,
                    inject: 'log',
                    options: {
                        console: {
                            level: 'debug',
                            colorize: true,
                            label: 'app'
                        }
                    }
                },
                http: {
                    enabled: true,
                    inject: 'log.http',
                    options: {
                        console: {
                            level: 'debug',
                            colorize: true,
                            label: 'http'
                        }
                    }
                }
            },
            app: {
                enabled: true,
                format: '{message}',
                logger: 'log'
            },
            request: {
                enabled: true,
                format: '{method} - {status} - {duration}ms - {url}',
                logger: 'log.http',
                slow: {
                    enabled: true,
                    format: '[pending] {method} - {duration}ms - {url}'
                }
            }
        }),
        initializer('posts'),
        routes('main'),
    ],
};
