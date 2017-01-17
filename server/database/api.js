"use strict";
var mysql = require("mysql");
var core_js_1 = require("core-js");
var API = (function () {
    function API(settings) {
        this.connection = mysql.createConnection(settings);
    }
    API.prototype.query = function (sql) {
        var _this = this;
        return new core_js_1.Promise(function (resolve, reject) {
            var options = {
                sql: sql,
                nestTables: true
            };
            _this.connection.query(options, function (err, rows, fields) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
            _this.connection.end();
        });
    };
    API.prototype.consultantsList = function () {
        var sql = "SELECT cu.* FROM cao_usuario cu JOIN permissao_sistema ps ON ps.co_sistema = 1 AND ps.in_ativo = 'S' AND ps.co_tipo_usuario IN (0,1,2) AND ps.co_usuario = cu.co_usuario";
        return this.query(sql);
    };
    API.prototype.report = function (co_usuario, dateInterval) {
        var sql = "SELECT cf.* FROM cao_fatura cf JOIN cao_os os ON cf.co_os = os.co_os WHERE os.co_usuario = '" + co_usuario + "' AND cf.data_emissao BETWEEN '" + dateInterval.start + "' AND '" + dateInterval.end + "' ORDER BY `cf`.`data_emissao` ASC";
        return this.query(sql);
    };
    API.prototype.salary = function (co_usuario) {
        var sql = "SELECT * FROM cao_salario cs WHERE `cs`.`co_usuario`= 'carlos.arruda'";
        return this.query(sql);
    };
    return API;
}());
exports.API = API;
// let api = new API({
//   host     : 'localhost',
//   user     : 'root',
//   password : '1',
//   database : 'agence'
// });
// api.consultantsList()
//   .then((result)=>{
//     // console.log('result',result);
//     console.log(result[0]);
//   })
//   .catch((err)=>{
//     throw err;
//   })
/*
  carlos.arruda
  2007-07-1
  2007-08-30
*/
// api.report('carlos.arruda',{start: '2007-08-1', end: '2007-08-30'})
//   .then((result)=>{
//     // console.log('result',result);
//   })
//   .catch((err)=>{
//     throw err;
//   })
// api.salary('carlos.arruda')
//   .then((result)=>{
//     console.log('result',result[0].cs.co_usuario);
//     console.log('result',result[0].cs.brut_salario);
//   })
//   .catch((err)=>{
//     throw err;
//   })
