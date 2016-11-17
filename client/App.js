import React from 'react'
import SpellCanvas from './SpellCanvas'
import SpellDrawer from './SpellDrawer'
import range from '../common/range'
import getDirections from '../common/getDirections'
import smoothenValues from '../common/smoothenValues'

import './App.scss'

const colors = [
    "255, 30, 0",
    "255, 175, 0",
    "0, 175, 255",
    "175, 0, 255"
]

export default React.createClass({
    displayName: 'App',

    getInitialState() {
        return {
            color: 0,
            points: null
        }
    },

    handleStart() {
        this.setState({ points: [] })
    },

    handleChange(points) {
        this.setState({ 
            points: points.map(
                (point, i) => i < points.length - 1000 ? null : point
            ) 
        })
    },

    handleEnd() {
        const lastPoints = this.state.points.filter(
            (point, i) => i >= this.state.points.length - 1000
        )
        const directions = getDirections(lastPoints)
        //const smoothenDirections = smoothenValues(directions)
        const tresholdDirections = directions.map(
            arc => Math.round(arc % 360 / 45) * 45 % 360
        )
        const foldDirections = tresholdDirections.length
            ? tresholdDirections.reduce(
                (result, arc) => {
                    if (result.length === 0) {
                        return [{arc, occurrences: 1}]
                    }
                    if (result[result.length - 1].arc === arc) {
                        const occurrences = result[result.length - 1].occurrences + 1
                        return result.slice(0, result.length - 1).concat([{ arc, occurrences }])
                    }
                    return result.concat([{arc, occurrences: 1}])
                },
                []
            ) 
            : []
        //const importantDirections = foldDirections.filter(entry => entry.occurrences > tresholdDirections.length / )
        //console.table([directions, smoothenDirections, tresholdDirections])
        console.log(JSON.stringify(foldDirections))
        this.setState({color: (this.state.color + 1) % colors.length})
    },

    render() {
        return (
            <div id="App">
                <SpellCanvas points={
                    this.state.points || range(0, 250).map(() => [
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    ])
                } color={
                    colors[this.state.color]
                }/>
                <SpellDrawer
                    onStart={this.handleStart}
                    onChange={this.handleChange}
                    onEnd={this.handleEnd}
                />
            </div>
        )
    }
})
