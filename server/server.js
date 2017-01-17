"use strict";
// set up ========================
var express = require("express");
var morgan = require("morgan"); // log requests to the console (express4)
var path = require("path"); // normalize the paths : http://stackoverflow.com/questions/9756567/do-you-need-to-use-path-join-in-node-js
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
var helmet = require("helmet"); // Security
var compression = require("compression");
var routes = require("./routes");
var App = (function () {
    function App(NODE_ENV, PORT) {
        if (NODE_ENV === void 0) { NODE_ENV = 'development'; }
        if (PORT === void 0) { PORT = 3000; }
        /**
         * Setting environment for development|production
         */
        process.env.NODE_ENV = process.env.NODE_ENV || NODE_ENV;
        /**
         * Setting port number
         */
        process.env.PORT = process.env.PORT || PORT;
        /**
         * Create our app w/ express
         */
        this.app = express();
        this.app.use(helmet());
        if (NODE_ENV === 'development') {
            this.app.use(express.static(path.join(process.cwd(), 'public')));
            this.app.use('/bower_components', express.static(path.join(process.cwd(), 'bower_components'))); // set the static files location of bower_components
            this.app.use('/node_modules', express.static(path.join(process.cwd(), 'node_modules'))); // set the static files location of node_modules
            this.app.use(morgan('dev')); // log every request to the console
        }
        else {
            this.app.use(compression());
            this.app.use(express.static(path.join(process.cwd(), 'dist'), { maxAge: '7d' })); // set the static files location /public/img will be /img for users
        }
        this.app.use(bodyParser.urlencoded({ 'extended': true })); // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.json()); // parse application/json
        this.app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        this.app.use(methodOverride());
        /**
         * Setting routes
       */
        var __routes = new routes.Routes(process.env.NODE_ENV);
        __routes.paths(this.app);
        /**
          * START the server
        */
        this.app.listen(process.env.PORT, function () {
            console.log('The server is running in port localhost: ', process.env.PORT);
        });
    }
    return App;
}());
exports.App = App;
