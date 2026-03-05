import Redis from 'ioredis'

let redis = null

export function getRedis() {
    if (!redis && process.env.REDIS_URL) {
        redis = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            connectTimeout: 5000,
        })
    }
    return redis
}
