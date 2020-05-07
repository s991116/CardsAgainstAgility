import express from "express";
import cors from "cors";
import * as http from "http";
import { Routes } from "./routes/gameRoutes";
import path from 'path';

const morgan = require("morgan");
const bodyParser = require("body-parser");

export class GameServer {
  public routePrv: Routes = new Routes();
  public server: http.Server;
  private app: express.Application;

  constructor() {
    this.createApp();
    this.createServer();
    this.routePrv.routes(this.app, this.server);
    this.listen();
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private createApp(): void {
    this.app = express();
    this.app.use(morgan("common"));
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  
  private listen(): void {
    this.server.listen(this.routePrv.port, () => {
      var htmlPath = path.resolve(__dirname + "./../../../client/dist/client/");
      console.log("Path for client: " + htmlPath);

      console.log("Express server is now listening on port " + this.routePrv.port);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}