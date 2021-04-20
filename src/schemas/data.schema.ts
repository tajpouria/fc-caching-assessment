import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataDocument = Data & Document;

@Schema({ versionKey: false })
export class Data {
  @Prop({ required: true })
  value: string;
}

export const DataSchema = SchemaFactory.createForClass(Data);

DataSchema.method('toJSON', function() {
  const obj: any = this.toObject();
  obj.key = obj._id;
  delete obj._id;
  return obj;
});
