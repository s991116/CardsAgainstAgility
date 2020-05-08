import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose';
import { GameState } from './gameState';
import { UserSchema } from './userModel';

export class SessionSchema {
  private userSchema = new UserSchema();  
  
  readonly Schema = createSchema({
      name: Type.string({default: ""}),
      state: Type.string({ required: true}),
      creation_date: Type.date({ default: Date.now as any}),
      users: Type.array( {required: true}).of(this.userSchema.Schema)
    });
    
    readonly Model = typedModel('Session', this.Schema);    
}