'use strict';

var minimatch = require('minimatch');
var objectAssign = require('object-assign');

module.exports = function (options) {
    options = objectAssign({}, {
        ignore: [],
        prefix: ''
    }, options);

    if (typeof options.ignore == 'string') {
        options.ignore = [options.ignore];
    }

    return function posthtmlPrefixClass(tree) {
        return tree.walk(function (node) {
            var attrs = node.attrs || false;
            var classNames = attrs.class && attrs.class.split(' ');
            var ngClassNames = attrs['ng-class'];

            if (classNames) {
                node.attrs.class = prefixClasses(classNames, options);
            }

            if (ngClassNames) {
                node.attrs['ng-class'] = prefixNgClasses(ngClassNames, options);
            }

            return node;
        });
    };
};


function prefixClasses(classNames, options) {
    return classNames.map(function (className) {
        var shouldBeIgnored = options.ignore.some(function (pattern) {
            return minimatch(className, pattern);
        });

        if (!shouldBeIgnored) {
            className = options.prefix + className;
        }

        return className;
    }).join(' ');
}

function prefixNgClasses(ngClassNames, options) {
    var regexp = new RegExp("(?:'?)([a-zA-Z0-9_ -]*)(?:'? *?)(?:: *)([^,\{\}]+)(?:,?)", 'gim');
    var map = [];
    ngClassNames.replace(regexp, function(found, className, expressionValue) {
        var classNames = className.trim().split(' ');
        var newClassNames = [];
        classNames.forEach(function (value) {
            var shouldBeIgnored = options.ignore.some(function (pattern) {
                return minimatch(value, pattern);
            });

            if (!shouldBeIgnored) {
                value = options.prefix + value;
            }

            newClassNames.push(value);
        });

        map.push("'" + newClassNames.join(' ') + "':" + expressionValue);
    });

    return "{" + map.join(',')+ "}";
}
