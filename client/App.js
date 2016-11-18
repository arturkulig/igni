import React from 'react'
import SpellCanvas from './SpellCanvas'
import SpellDrawer from './SpellDrawer'
import range from '../common/range'
import {learn, recognize} from '../common/shapes'
import getDirections from '../common/getDirections'
import smoothenValues from '../common/smoothenValues'

import './App.scss'

const colors = [
    "255, 30, 0",
    "255, 175, 0",
    "0, 175, 255",
    "175, 0, 255"
]

const signShapes = [
    ['quen', [0, 0, 45, 180, 180, 180, 295, 295, 295, 295, 295, 65, 65]],
    ['igni', [240, 240, 240, 240, 240, 0, 0, 0, 0, 120, 120, 120]],
    ['yrden', [0, 0, 0, 230, 230, 230, 230, 230, 0, 0, 0, 140, 140, 140, 140, 140]],
    ['aard', [240, 240, 120, 120, 120, 120, 120, 0, 0, 0, 0]],
]

const signColors = {
    quen: '255, 175, 0',
    igni: '255, 30, 0',
    yrden: '175, 0, 255',
    aard: '0, 175, 255'
}

export default React.createClass({
    displayName: 'App',

    getInitialState() {
        return {
            sign: null,
            points: null
        }
    },

    handleStart() {
        this.setState({ points: [], sign: null })
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
        const smoothenDirections = smoothenValues(directions)
        this.setState({ sign: recognize(smoothenDirections, signShapes) })
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
                    this.state.sign ? signColors[this.state.sign] : '200, 200, 200'
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
