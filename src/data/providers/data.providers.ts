import { Connection } from 'mongoose';
import { DataSchema } from 'src/schemas/data.schema';

export const dataProviders = [
  {
    provide: 'DATA_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Data', DataSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
