export function normalize(text) {
    if (!text || typeof text !== 'string') return ''
    const lowered = text.toLowerCase()
    return text.charAt(0).toUpperCase() + lowered.slice(1)
}