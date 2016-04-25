# posthtml-prefix-class-angular

[PostHTML](https://github.com/posthtml/posthtml) plugin to prefix class names and ng-class object expressions.
It supports only simple object expressions till now e.g.
```html
<div ng-class="{test: vm.isTest, 'is-visible': vm.isVisible}">/div>
```

Feel free to extend it ;)

## Installation

```shell
npm install --save-dev posthtml-prefix-class-angular
```

## Usage

```js
var posthtml = require('posthtml');
var posthtmlPrefixClass = require('posthtml-prefix-class-angular');

posthtml()
    .use(posthtmlPrefixClass({
        prefix: 'prefix-',
        ignore: ['selector-2']
    }))
    .process(
        '<div ng-class="{\'is-visible\': vm.isVisible}"><div class="selector-2"></div></div>'
    )
    .then(function (output) {
        console.log(output.html);
        // <div ng-class="{'prefix-is-visible':vm.isVisible}"><div class="prefix-selector-2"></div></div>
    });
```

## Options

### `prefix`

Type: `String`  
Default: `''`

The string used to prefix class names.

### `ignore`

Type: `Array|String`  
Default: `[]`

A class name, or an array of class names, to be excluded from prefixing.
**Accepts any glob expression supported by [minimatch](https://github.com/isaacs/minimatch).**

```js
var posthtml = require('posthtml');
var posthtmlPrefixClass = require('posthtml-prefix-class-angular');

posthtml()
    .use(posthtmlPrefixClass({
        prefix: 'prefix-',
        ignore: ['selector-2']
    }))
    .process(
        '<div ng-class="{\'is-visible\': vm.isVisible}"><div class="selector-2"></div></div>'
    )
    .then(function (output) {
        console.log(output.html);
        // <div ng-class="{'is-visible':vm.isVisible}"><div class="selector-2"></div></div>
    });
```

## Testing

```shell
npm test
```
