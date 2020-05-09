import { Request, Response } from "express";
import { GameState, User } from "./../model"
import { v4 as uuidv4 } from "uuid";
import { DB } from "./db";

export class GameController {
  private socketIdWithSession: { [sessionId: string]: string };

  constructor() {
    this.socketIdWithSession = {};
  }

  public async createSession(req: Request, res: Response, io: SocketIO.Server) {
    let _state: GameState = "drawQuestion";
    let s = new DB.Models.Session.Model({
      name: req.body.sessionName,
      state: _state,
    });
    await s.save();

    io.in(s._id).emit("status", s);
    res.json({ sessionId: s._id });
  }

  public async createUser(req: Request, res: Response, io: SocketIO.Server) {
    let sessionId = req.body.sessionId;
    let socketId = req.body.socketId;
    DB.Models.Session.Model.findById(sessionId, async (err: any, session: any) => {
      if (session) {        
        let user = new User(uuidv4(), "User", socketId);
        session.users.push(user);
        this.socketIdWithSession[socketId] = sessionId;
        await session.save();
        io.in(sessionId).emit("status", session);
        res.json(user);
      } else {
        res.status(400).json({
          status: "error",
          error: "sessionId do not exists",
        });
      }
    });
  }

  public async removeDisconnectedUser(socket: SocketIO.Socket) {
    let sessionId = this.socketIdWithSession[socket.id];
    await DB.Models.Session.Model.findById(sessionId, async (err: any, session: any) => {
      if (session) {
        let users = session.users;
        if (users) {
          users.forEach((item: any, index: any) => {
            if (item.socketId === socket.id) {
              session.users.pull(item._id);
            }
          });
        }
        await session.save((err: any, s: any) => {
          if (s) {
            socket.in(sessionId).emit("status", session);
          } else {
            console.log("Error removing player with sockedID: " + socket.id);
            console.log("Error: " + err);
          }
        });
      }
    });
  }

  
  public async updateName(req: Request, res: Response, io: SocketIO.Server) {
    let sessionId = req.body.id;
    let userName = req.body.userName;
    let userId = req.body.userId;
    console.log("sessionId: " + sessionId);
    await DB.Models.Session.Model.findById(sessionId, async (err: any, session: any) => {
      if (session) {
        let user = session.users.find((i: any) => i._id === userId);
        if (user) {
          user.name = userName;
          await session.save();
          io.in(sessionId).emit("status", session);
          res.json(session);
        } else {
          res.status(400).json({
            status: "error",
            error: "userID do not exists",
          });
        }
      } else {
        res.status(400).json({
          status: "error",
          error: "sessionId do not exists",
        });
      }
    });
  }

}
