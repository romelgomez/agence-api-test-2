import * as mysql from "mysql";
import { Promise } from "core-js";

interface IConsultantsList {
  cu: {
  	valor:number;
    total_imp_inc:number;
    comissao_cn: number;
  }
}

interface IReport{
  cf: {
    valor:number;
    comissao_cn:number;
    total_imp_inc:number;
  }
}

interface ISalary {
  cs:{
    co_usuario:string;
    brut_salario:number;
  }
}

export class API {

  private connection: mysql.IConnection;

  constructor(settings: mysql.IConnectionConfig){
    this.connection = mysql.createConnection(settings);
  }

  private query<T>(sql:string): Promise<T> {
    return new Promise((resolve, reject) => {

      let options: mysql.IQueryOptions = {
        sql: sql,
        nestTables: true
      };

      this.connection.query(options, function(err, rows, fields) {
        if (err){
          reject(err)
        }else{
          resolve(rows);
        }
      });

      this.connection.end();
    });
  }

  consultantsList(): Promise<Array<IConsultantsList>>{
    let sql:string = "SELECT cu.* FROM cao_usuario cu JOIN permissao_sistema ps ON ps.co_sistema = 1 AND ps.in_ativo = 'S' AND ps.co_tipo_usuario IN (0,1,2) AND ps.co_usuario = cu.co_usuario";
    return this.query<Array<IConsultantsList>>(sql);
  }

  report(co_usuario: string, dateInterval: {start: string; end: string}): Promise<Array<IReport>> {
    let sql:string = "SELECT cf.* FROM cao_fatura cf JOIN cao_os os ON cf.co_os = os.co_os WHERE os.co_usuario = '" + co_usuario + "' AND cf.data_emissao BETWEEN '"+ dateInterval.start + "' AND '"+ dateInterval.end + "' ORDER BY `cf`.`data_emissao` ASC";
    return this.query<Array<IReport>>(sql);
  }

  salary(co_usuario: string): Promise<Array<ISalary>> {
    let sql:string = "SELECT * FROM cao_salario cs WHERE `cs`.`co_usuario`= 'carlos.arruda'";
    return this.query<Array<ISalary>>(sql);
  }

}

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
