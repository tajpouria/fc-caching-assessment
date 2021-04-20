import { Data } from 'src/schemas/data.schema';

export interface CacheType<DataT = any> {
  /** Cache store component */
  store: any;

  /** Retrieve data by key */
  get(key: string): Promise<DataT | null>;

  /** Retrieve a list of keys */
  keys(): Promise<Partial<DataT>[]>;

  /** Store key -> value for time to live */
  set(value: string, ttl: number): Promise<DataT>;

  /** Update and store key -> value for time to live(TTL) */
  update(key: string, value: string, ttl: number): Promise<Data>;

  /** Delete value associate to cache */
  del(key: string): Promise<void>;

  /** Wipe the cache */
  flush(): Promise<void>;
}
