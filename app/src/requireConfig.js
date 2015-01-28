/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        react: '../lib/react/react',
        backbone: '../lib/backbone/backbone',
        underscore: '../lib/underscore/underscore',
        jquery: '../lib/jquery/dist/jquery'
    },
    packages: [

    ]
});
require(['main']);
