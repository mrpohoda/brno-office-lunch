export function markTomato (result) {
    Object.entries(result).forEach(([key, value]) => {
        if (typeof value === 'string' && value.toLowerCase().includes('raj')) {
            result[key] = value + ' 🍅';
        }
    })

}
