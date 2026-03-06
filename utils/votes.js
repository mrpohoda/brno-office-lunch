import {getRedis} from './redis'
import {revalidatePath} from 'next/cache'
import {cache} from 'react'

// cache() deduplicuje Redis volání — všech 6 VoteSection sdílí jeden fetch za render
export const getVotes = cache(async () => {
    const today = new Date().toISOString().slice(0, 10)
    const redis = getRedis()
    if (!redis) return {}
    try {
        const raw = await redis.get(`votes:${today}`)
        return raw ? JSON.parse(raw) : {}
    } catch { return {} }
})

export async function toggleVote(restaurant, name) {
    'use server'
    if (!name?.trim()) return
    const today = new Date().toISOString().slice(0, 10)
    const redis = getRedis()
    if (!redis) return
    const key = `votes:${today}`
    const raw = await redis.get(key)
    const votes = raw ? JSON.parse(raw) : {}
    const list = votes[restaurant] || []
    votes[restaurant] = list.includes(name)
        ? list.filter(n => n !== name)
        : [...list, name]
    await redis.set(key, JSON.stringify(votes), 'EX', 108000) // 30 h
    revalidatePath('/')
}
