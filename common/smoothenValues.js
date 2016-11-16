export default function smoothenValues (values = [], reach = 0.05) {
    const reachAbs = values.length * reach
    const blur = values.map(v => v)   
    for (let i = 0; i < values.length; i++) {
        for (let j = Math.round(reachAbs / -2); j < Math.round(reachAbs / 2); j++) {
            const inPlaceValue = getIn(values, i)
            const pullingValue = getIn(values, i + j)
            const diff = pullingValue - inPlaceValue
            const pulling = Math.abs(diff) > 180
                ? (360 - Math.abs(diff)) * Math.sign(diff) % 360
                : diff

            setIn(
                blur,
                i,
                getIn(blur, i) + pulling / reachAbs
            )
        } 
    }
    return blur
}

function getIn (values, idx) {
    if (idx < 0) return values[0]
    if (idx >= values.length) return values[values.length - 1]
    return values[idx]
}

function setIn (values, idx, value) {
    if (idx < 0) values[0] = value
    if (idx >= values.length) values[values.length - 1] = value
     values[idx] = value
}
