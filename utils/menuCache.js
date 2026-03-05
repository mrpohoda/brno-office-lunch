import {getRedis} from './redis'

export async function getCachedMenu(key, fetchFn) {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
    const cacheKey = `${key}:${today}`

    const redis = getRedis()
    if (redis) {
        try {
            const cached = await redis.get(cacheKey)
            if (cached) return JSON.parse(cached)
        } catch { /* Redis nedostupný — pokračuj na fetch */ }
    }

    const result = await fetchFn()

    if (redis && result) {
        try {
            await redis.set(cacheKey, JSON.stringify(result), 'EX', 90000) // 25 h
        } catch { /* zápis selhal — není kritické */ }
    }

    return result
}
