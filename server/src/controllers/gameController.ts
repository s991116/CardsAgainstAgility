import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export class GameController {
  private socketIdWithSession: { [sessionId: string]: string };

  constructor() {
    this.socketIdWithSession = {};
  }


}
