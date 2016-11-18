import React from 'react'

import './SpellDrawer.scss'
export default React.createClass({
    displayName: 'SpellDrawer',

    propTypes: {
        onStart: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onEnd: React.PropTypes.func,
        minStep: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            minStep: 5
        }
    },

    shouldComponentUpdate() {
        return false
    },

    handleMouseDown(event) {
        this.resetPoints()
        const {onStart = () => null} = this.props
        onStart()
        this.handleMouseMove(event)
    },

    handleMouseMove(event) {
        if (!this.points) return
        this.addPoint(event.clientX, event.clientY)
        const {onChange = () => null} = this.props
        onChange(this.points)
        event.preventDefault()
    },

    handleMouseUp(event) {
        if (!this.points) return
        this.clearPoints()
        const {onEnd = () => null} = this.props
        onEnd()
        event.preventDefault()
    },

    handleTouchStart (event) {
        if (event.touches.length === 1) {
            this.resetPoints()
            const {onStart = () => null} = this.props
            onStart()
        }
        this.handleTouchMove(event)
    },

    handleTouchMove (event) {
        if (!this.points) return
        for (let i = 0; i < 1; i++) {
            const touch = event.touches.item(i)
            this.addPoint(touch.clientX, touch.clientY)
        }
        const {onChange = () => null} = this.props
        onChange(this.points)
        event.preventDefault()
    },

    handleTouchEnd (event) {
        if (event.touches.length !== 0) return
        this.handleMouseUp(event)
    },

    addPoint(x, y) {
        if (this.userPoints.length < 3){
            this.points.push([x, y])
            this.userPoints.push([x, y])
            return
        }
        const pushedBefore = last(this.userPoints)
        const distance = Math.sqrt(Math.pow(x - pushedBefore[0], 2) + Math.pow(y - pushedBefore[1], 2))
        if (distance < this.props.minStep) return
        this.points.push([x, y])
        this.userPoints.push([x, y])
    },

    resetPoints () {
        this.points = []
        this.userPoints = []
    },

    clearPoints () {
        this.points = null
    },

    render() {
        return (
            <div
                className="SpellDrawer"
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            />
        )
    }
})

function last (collection, pre = 0) {
    return collection[collection.length - 1 - pre]
}
