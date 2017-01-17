"use strict";
var path = require("path"); // normalize the paths : http://stackoverflow.com/questions/9756567/do-you-need-to-use-path-join-in-node-js
var database = require("./database/api");
var Routes = (function () {
    function Routes(NODE_ENV) {
        switch (NODE_ENV) {
            case 'production':
                this.basePath = '/app/dist';
                break;
            case 'development':
                this.basePath = '/app/public';
                break;
        }
        this.api = new database.API({
            host: 'localhost',
            user: 'root',
            password: '1',
            database: 'agence'
        });
    }
    Routes.prototype.defaultRoute = function (req, res) {
        res.sendFile('index.html', { root: path.join(process.cwd(), this.basePath) });
    };
    Routes.prototype.errorRoute = function (req, res) {
        res.sendFile('error.html', { root: path.join(process.cwd(), this.basePath) });
    };
    Routes.prototype.paths = function (app) {
        var _this = this;
        app.get('/', function (req, res) {
            _this.defaultRoute(req, res);
        });
        app.get('/consultants-list', function (req, res) {
            _this.api.consultantsList()
                .then(function (result) {
                res.send(result);
            })
                .catch(function (err) {
                res.redirect('/error');
            });
        });
        app.get('/report/:co_usuario/:date_interval_start/:date_interval_end', function (req, res) {
            _this.api.report(req.params.co_usuario, { start: req.params.date_interval_start, end: req.params.date_interval_end })
                .then(function (result) {
                res.send(result);
            })
                .catch(function (err) {
                res.redirect('/error');
            });
        });
        app.get('/report/:co_usuario', function (req, res) {
            _this.api.salary(req.params.co_usuario)
                .then(function (result) {
                res.send(result);
            })
                .catch(function (err) {
                res.redirect('/error');
            });
        });
        app.get('/error', function (req, res) {
            _this.errorRoute(req, res);
        });
        app.get('*', function (req, res) {
            _this.errorRoute(req, res);
        });
    };
    return Routes;
}());
exports.Routes = Routes;
