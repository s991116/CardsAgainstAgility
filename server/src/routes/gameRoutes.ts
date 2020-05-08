import { Request, Response } from "express";
import express from "express";
import * as http from "http";
import path from "path";
import { GameController } from "../controllers/gameController";
export class Routes {
  private io: SocketIO.Server;
  public port: string | number;
  public gameController: GameController = new GameController();

  public static readonly PORT: number = 8080;

  private config(): void {
    this.port = process.env.PORT || Routes.PORT;
  }

  constructor() {
    this.config();
  }

  private socketRouting(server: http.Server) {
    this.io = require("socket.io").listen(server, { origins: "*:*" });
    console.log("Socket setup");
    this.io.on("connection", (socket) => {
      socket.on("sessionRoom", (sessionRoomID) => {
        socket.join(sessionRoomID);
      });
      socket.on("disconnect", () => {
        this.gameController.removeDisconnectedUser(socket);
      });
    });
  }

  public routes(app: express.Application, server: http.Server): void {
    this.socketRouting(server);
    var htmlPath = path.resolve(__dirname + "./../../../client/dist/client/");

    app.route("*.*").get(express.static(htmlPath, { maxAge: "1h" }));

    app.route("/").get((req: Request, res: Response) => {
      console.log("get file:" + htmlPath);
      res.status(200).sendFile(`/`, { root: htmlPath });
    });

    app.route("/session/*").get((req: Request, res: Response) => {
      res.status(200).sendFile(`/`, { root: htmlPath });
    });

    app.route("/createSession").post(async (req: Request, res: Response) => {
      this.gameController.createSession(req, res, this.io);
    });

    app.route("/createUser").post((req: Request, res: Response) => {
      this.gameController.createUser(req, res, this.io);
    });

    app.route("/updateName").post((req: Request, res: Response) => {
      this.gameController.updateName(req, res, this.io);
    });

  }
}
