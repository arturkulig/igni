import range from './range'

export function recognize (directions, knownShapes) {
    if (knownShapes.length === 0) return null
    if (knownShapes.length === 1) return knownShapes[0]
    const similarities = knownShapes.map(
        ([name, knownShape]) => {
            const maxResolution = Math.min(directions.length, knownShape.length)
            const similarity = range(0, maxResolution).map(
                i => {
                    const difference = Math.abs(
                        directions[Math.round(i / maxResolution * (directions.length - 1))] -
                        knownShape[Math.round(i / maxResolution * (knownShape.length - 1))]
                    )
                    return (
                        Math.pow(
                            1 - difference / 360,
                            8
                        ) 
                    )
                }
            ).reduce(
                (result, arcDifference) => result + arcDifference / maxResolution,
                0
            )
            return {name, similarity}
        }
    )
    console.table(similarities)
    return similarities.reduce(
        (result, shape) => shape.similarity > result.similarity ? shape : result,
        similarities[0]
    )
}
