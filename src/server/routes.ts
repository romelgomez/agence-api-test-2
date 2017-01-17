import * as path from "path" // normalize the paths : http://stackoverflow.com/questions/9756567/do-you-need-to-use-path-join-in-node-js
import express = require('express');
import * as database from "./database/api";


export class Routes {

  protected basePath: string;

  protected api: database.API;

  constructor(NODE_ENV: string){

    switch(NODE_ENV) {
      case 'production':
        this.basePath = '/app/dist';
        break;
      case 'development':
        this.basePath = '/app/public';
        break;
    }


    this.api = new database.API({
      host     : 'localhost',
      user     : 'root',
      password : '1',
      database : 'agence'
    });

  }

  defaultRoute(req: express.Request, res: express.Response){
    res.sendFile('index.html', {root: path.join(process.cwd(), this.basePath)});
  }

  errorRoute(req: express.Request, res: express.Response){
    res.sendFile('error.html', {root: path.join(process.cwd(), this.basePath)});
  }

  paths(app: express.Application) {

    app.get('/', (req: express.Request, res: express.Response) => {
      this.defaultRoute(req, res);
    });

    app.get('/consultants-list',(req: express.Request, res: express.Response)=>{

        this.api.consultantsList()
          .then((result)=>{
            res.send(result);
          })
          .catch((err)=>{
            res.redirect('/error');
          })

    });

    app.get('/report/:co_usuario/:date_interval_start/:date_interval_end',(req: express.Request, res: express.Response)=>{

        this.api.report(req.params.co_usuario,{start:req.params.date_interval_start, end:req.params.date_interval_end})
          .then((result)=>{
            res.send(result);
          })
          .catch((err)=>{
            res.redirect('/error');
          });

    });

    app.get('/report/:co_usuario',(req: express.Request, res: express.Response)=>{

        this.api.salary(req.params.co_usuario)
          .then((result)=>{
            res.send(result);
          })
          .catch((err)=>{
            res.redirect('/error');
          });

    });

    app.get('/error', (req: express.Request, res: express.Response) => {
      this.errorRoute(req, res);
    });

    app.get('*', (req: express.Request, res: express.Response) => {
      this.errorRoute(req, res);
    });

  }

}
