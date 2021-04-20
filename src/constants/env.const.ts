const { MONGO_DB_CONNECTION_URL } = process.env;

/**
 * Exposes environments constants
 */
export const envConst: Record<string, string | null> = {
  /** Mongo DB instance connection URL */
  MONGO_DB_CONNECTION_URL:
    MONGO_DB_CONNECTION_URL || 'mongodb://localhost:27017/data',
};
