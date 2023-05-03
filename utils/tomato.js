export function markTomato (result) {
    Object.entries(result).forEach(([key, value]) => {
        if (value.toLowerCase().includes('raj')) {
            result[key] = value + ' 🍅';
        }
    })

}
