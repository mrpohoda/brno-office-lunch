export function markTomato(result) {
    Object.entries(result).forEach(([key, value]) => {
        if (typeof value === 'string' && value.toLowerCase().includes('raj')) {
            result[key] = value + ' 🍅'
        } else if (Array.isArray(value)) {
            value.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    Object.entries(item).forEach(([k, v]) => {
                        if (typeof v === 'string' && v.toLowerCase().includes('raj')) {
                            item[k] = v + ' 🍅'
                        }
                    })
                }
            })
        }
    })
}
