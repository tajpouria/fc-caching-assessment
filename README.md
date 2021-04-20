# FC Caching Assessment

[Task board](https://trello.com/b/50EjI6LV/fc-cache-challenge)

## Environment

Assuming application running on an environment with **Node >= 10.13.0 and NPM >= 6.0.0** available, Following environment variables need to be provided:

| Variable                | Description                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| MONGO_DB_CONNECTION_URL | Mongo DB instance connection URL, ( default: `mongodb://localhost:27017/data` )            |
| CACHE_DEFAULT_TTL_SEC   | Cached data default time to live in seconds. ( default: `120` )                            |
| CACHE_MAX_RECORD_COUNTS | Designate the maximum number of the record that can store in the cache. ( default: `120` ) |
| ARB_AUTH_TOKEN          | An arbitrary authorization token to manage access. ( default: `not set` )                  |

## Commands

```sh
# Install required dependencies
> npm i

# Compile typescript to javascript
> build

# Format source code
> format

# Start application in 'development' mode
> start

# Start application in 'development' mode with tsc watch enabled
> start:dev

# Start application in 'production' mode, Process will exist with non-zero code on application level exceptions
> start:prod

# Run test and generate test converge report at '<rootDir>/coverage/', Process will exist with non-zero code on test condition failure
> test:cov
```

## API

Assumed application running on host `localhost`, and port `3000`, API is available on `http://localhost:3000/api/`
