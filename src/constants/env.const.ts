const {
  MONGO_DB_CONNECTION_URL,
  CACHE_DEFAULT_TTL_SEC,
  CACHE_MAX_RECORD_COUNTS,
  ARB_AUTH_TOKEN,
} = process.env;

/**
 * Exposes environments constants
 */
export const envConst: Record<string, string | null> = {
  /** Mongo DB instance connection URL */
  MONGO_DB_CONNECTION_URL:
    MONGO_DB_CONNECTION_URL || 'mongodb://localhost:27017/data',

  /** Cache default time to live  */
  CACHE_DEFAULT_TTL_SEC: CACHE_DEFAULT_TTL_SEC || '120',

  /**
   * Designate the maximum number of the record that can store inside the cache
   * @link https://docs.mongodb.com/manual/core/capped-collections/#capped-collections
   */
  CACHE_MAX_RECORD_COUNTS: CACHE_MAX_RECORD_COUNTS || '10',

  /**
   * An arbitrary authorization token to manage access
   */
  ARB_AUTH_TOKEN: ARB_AUTH_TOKEN || null,
};
