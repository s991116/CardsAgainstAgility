import { connect, connection, Connection } from 'mongoose';
import { SessionSchema } from './../model/sessionModel';
declare interface IModels {
    Session: SessionSchema;
}

export class DB {

    private static instance: DB;
    
    private _db: Connection; 
    private _models: IModels;

    private constructor() {
        let connectionString: string = process.env.dbConnection || "mongodb://localhost:27017/CardsAgainstAgility";
        connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
            Session: new SessionSchema(),
            // this is where we initialise all models
        }
    }

    public static get Models() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error:any) {
        console.log('Mongoose has errored', error);
    }
}