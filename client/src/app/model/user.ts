export class User {
  readonly _id: string;
  public name: string;
  readonly socketId: string;
  public cardIndex: number;
  public played: boolean;
  public isPlaying: boolean;

  constructor(id:string, name: string, socketId: string) {
    this._id = id;
    this.name = name;
    this.socketId = socketId;
    this.cardIndex = 0;
    this.played = false;
    this.isPlaying = true;
  }
}