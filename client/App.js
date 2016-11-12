import React from 'react'
import SpellCanvas from './SpellCanvas'
import SpellDrawer from './SpellDrawer'
import { range } from './utils'

import './App.scss'
export default React.createClass({
    displayName: 'App',

    getInitialState() {
        return {
            points: null
        }
    },

    handleStart() {
        this.setState({ points: [] })
    },

    handleChange(points) {
        this.setState({ points })
    },

    handleEnd() {
        //this.setState({ points: [] })
    },

    render() {
        return (
            <div id="App">
                <SpellCanvas points={
                    this.state.points || range(0, 250).map(() => [
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    ])
                } color="255, 30, 0" />
                <SpellDrawer
                    onStart={this.handleStart}
                    onChange={this.handleChange}
                    onEnd={this.handleEnd}
                />
            </div>
        )
    }
})
