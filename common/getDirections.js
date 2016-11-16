export default function getDirection (points = []) {
    const directions = []
    for (let i = 1; i < points.length; i++) {
        const [x2, y2] = points[i]
        const [x1, y1] = points[i - 1]

        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        
        switch (true) {
            case x2 === x1 && y2 === y1: break
            case x2 === x1: directions.push(y2 > y1 ? 270 : 90); break
            case y2 === y1: directions.push(x2 > x1 ? 0 : 180); break
            case x2 > x1 && y2 < y1: directions.push(90 - arc(dx, dy)); break
            case x2 < x1 && y2 < y1: directions.push(90 + arc(dx, dy)); break
            case x2 < x1 && y2 > y1: directions.push(270 - arc(dx, dy)); break
            case x2 > x1 && y2 > y1: directions.push(270 + arc(dx, dy)); break
            default: throw new Error()
        }
    }
    return directions
}

function arc (dx, dy) {
    return Math.atan(dx / dy) / Math.PI * 2 * 90
}
