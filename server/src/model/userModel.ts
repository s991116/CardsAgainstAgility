import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose';

export class UserSchema {
  
  readonly Schema = createSchema({
      _id: Type.string(),
      name: Type.string({required: true}),
      socketId: Type.string({ required: true}),
      cardIndex: Type.number({ required: true, default: 0}),
      played: Type.boolean({ required:true, default:false}),
      isPlaying: Type.boolean({ required: true, default:true})
    });
    
    readonly Model = typedModel('User', this.Schema);    
}