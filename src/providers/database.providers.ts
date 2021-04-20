import * as mongoose from 'mongoose';
import { envConst } from 'src/constants/env.const';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(envConst.MONGO_DB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
  },
];
