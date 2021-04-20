import { Schema } from 'mongoose';
import { Document } from 'mongoose';
import { envConst } from 'src/constants/env.const';

export const DataSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
  },
  {
    capped: {
      size: 1024,
      max: parseInt(envConst.CACHE_MAX_RECORD_COUNTS),
    },
  },
);

DataSchema.method('toJSON', function() {
  const obj: any = this.toObject();
  obj.key = obj._id;
  delete obj._id;
  return obj;
});

export interface Data extends Document {
  readonly value: string;
}
