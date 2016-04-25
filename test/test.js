'use strict';

var assert = require('assert');
var posthtml = require('posthtml');
var posthtmlPrefixClass = require('../index.js');

var input = '<div class="selector-1 selector-2"></div>';
var inputAngularNgClass = '<div ng-class="{strike: deleted, bold: important, ' + "'" + 'has-error' + "'" + ': error}"></div>';

function test(input, expected, options, done) {
    return posthtml()
        .use(posthtmlPrefixClass(options))
        .process(input)
        .then(function (output) {
            assert.equal(output.html, expected);
            done();
        })
        .catch(function (error) {
            done(error);
        });
}

describe('posthtml-prefix-class', function () {
    it('posthtmlPrefixClass()', function (done) {
        test(
            input,
            input,
            {},
            done
        );
    });

    it('posthtmlPrefixClass() with ng-class', function (done) {
        test(
            inputAngularNgClass,
            '<div ng-class="{\'strike\':deleted,\'bold\':important,' + "'" + 'has-error' + "'" + ':error}"></div>',
            {},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String })', function (done) {
        test(
            input,
            '<div class="prefix-selector-1 prefix-selector-2"></div>',
            {prefix: 'prefix-'},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String }) with ng-class', function (done) {
        test(
            inputAngularNgClass,
            '<div ng-class="{\'prefix-strike\':deleted,\'prefix-bold\':important,\'prefix-has-error\':error}"></div>',
            {prefix: 'prefix-'},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String }) with ng-class and multiline', function (done) {
        test(
            '<div ng-class="{\n' +
            '\'list-mode-new-item\': vm.isNewModeActive,\n'+
            '\'list-mode-edit-item\': vm.isEditModeActive,\n'+
            '\'list-mode-multi-list\' : vm.multiSelection'+
            '}"></div>',
            '<div ng-class="{\'prefix-list-mode-new-item\':vm.isNewModeActive,\'prefix-list-mode-edit-item\':vm.isEditModeActive,\'prefix-list-mode-multi-list\':vm.multiSelection}"></div>',
            {prefix: 'prefix-'},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String }) with ng-class and multi classes in one evaluation', function (done) {
        test(
            '<div ng-class="{\'btn btn-v4 btn-circle-3\' : !vm.multiSelection, \'btn btn-inline btn-no-circle\' : vm.multiSelection}"></div>',
            '<div ng-class="{\'prefix-btn prefix-btn-v4 prefix-btn-circle-3\':!vm.multiSelection,\'prefix-btn prefix-btn-inline prefix-btn-no-circle\':vm.multiSelection}"></div>',
            {prefix: 'prefix-'},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String, ignore: String })', function (done) {
        test(
            input,
            '<div class="prefix-selector-1 selector-2"></div>',
            {prefix: 'prefix-', ignore: 'selector-2'},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String, ignore: *String })', function (done) {
        test(
            input,
            '<div class="prefix-selector-1 selector-2"></div>',
            {prefix: 'prefix-', ignore: '*-2'},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String, ignore: Array })', function (done) {
        test(
            input,
            input,
            {prefix: 'prefix-', ignore: ['selector-1', 'selector-2']},
            done
        );
    });

    it('posthtmlPrefixClass({ prefix: String, ignore: *Array })', function (done) {
        test(
            input,
            input,
            {prefix: 'prefix-', ignore: ['*-1', '*-2']},
            done
        );
    });
});
