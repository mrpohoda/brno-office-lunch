export function normalize(text) {
    const lowered = text.toLowerCase()
    return text.charAt(0).toUpperCase() + lowered.slice(1)
}