'use strict';

module.exports = {
    entry: "./route/app.js",
    output: {
        path: "../Backend/app/static/js",
        filename: "route.js"
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }

        }]
    },

    devtool: "#inline-source-map",

    watch: true
};