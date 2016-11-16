export default function reduceArray (collection = [], limit = 0) {
    if (limit === 0) {
        return []
    }
    if (collection.length < limit) {
        return collection
    }
    const step = collection.length / limit
    const result = []
    for (let i = 0; i < limit; i++) {
        const position = Math.round(i * step)
        result[position] = collection[position]
    }
    return result
}

