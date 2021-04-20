import { Schema } from 'mongoose';
import { Document } from 'mongoose';
import { envConst } from 'src/constants/env.const';

const { CACHE_MAX_RECORD_COUNTS } = envConst;

export const DataSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    capped: {
      size: 1024,
      max: parseInt(CACHE_MAX_RECORD_COUNTS),
    },
  },
);

DataSchema.method('toJSON', function() {
  const obj: any = this.toObject();
  obj.key = obj._id;
  delete obj._id;
  delete obj.updatedAt;
  return obj;
});

export interface Data extends Document {
  readonly value: string;
}
