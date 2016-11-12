import React from 'react'
import { range } from './utils'

const tick = (
    window.requestAnimationFrame ||
    window.setTimeout
)

let frames = 0

const HEIGHT_SCALE = 0.5

import './SpellCanvas.scss'
export default React.createClass({
    displayName: 'SpellCanvas',

    propTypes: {
        points: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)),
        maxSize: React.PropTypes.number,
        maxAge: React.PropTypes.number,
        color: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            points: [],
            maxSize: 45,
            maxAge: 1000,
            color: '255, 255, 255'
        }
    },

    componentWillMount () {
        setInterval(() => {
            console.log('drawn', this.props.points.length, 'in', frames)
            frames = 0
        }, 1000)

        this.sparks = range(0, this.props.maxAge).map(age => {
            const spark = window.document.createElement('canvas')
            spark.width = spark.height = this.props.maxSize * 2
            const ctx = spark.getContext('2d')
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, spark.width, spark.height);
            const color = this.props.color
                .split(',')
                .map(s => s.trim())
                .map(s => parseInt(s, 10))
            drawSpark(ctx, this.props.maxSize, this.props.maxSize, color, age / this.props.maxAge, this.props.maxSize)
            return spark
        })
    },

    shouldComponentUpdate() {
        return false
    },

    refCanvas(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.loop()
    },

    loop() {
        if (this.looping) return
        this.looping = true

        this.ages = this.ages || []

        const { width, height } = this.canvas.parentNode.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height * HEIGHT_SCALE
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = "screen";
        const now = Date.now()
        for (let i = 0; i < this.props.points.length; i++) {
            const [x, y] = this.props.points[i]
            if (this.ages[i] === undefined) {
                this.ages[i] = now - Math.random() * this.props.maxAge
            }
            // 0-maxAge
            const age = Math.floor((now - this.ages[i]) % this.props.maxAge)
            const sizeVariation = this.props.maxSize * sway(i / 10)
            const size = this.props.maxSize * 2 + sizeVariation
            this.ctx.drawImage(
                this.sparks[age],
                x - size / 2,
                HEIGHT_SCALE * y - size / 2,
                size,
                size
            )
        }   
        frames++
        tick(() => {
            this.looping = false
            this.loop()
        })
    },

    render() {
        return (
            <canvas className="SpellCanvas" ref={this.refCanvas} />
        )
    }
})

function drawSpark (ctx, x, y, color, /* 0-1 */ age, size) {
    ctx.beginPath()
    const radius = size * age
    const opacity = 1 - age

    const innerColor = `${
            toByte((color[0] + 10) * 11 * opacity)
        },${
            toByte((color[1] + 10) * 11 * opacity)
        },${
            toByte((color[2] + 10) * 11 * opacity)
        }`
    const outerColor = `${
            toByte(color[0] * opacity)
        },${
            toByte(color[1] * opacity)
        },${
            toByte(color[2] * opacity)
        }`
    const gradient = ctx.createRadialGradient(
        x, 
        y + sway(age) * radius / 6, 
        0, 
        x + sway(age * (age % 4)) * radius / 4, 
        y - Math.min(radius - 10, radius * (3 + sway(age)) / 4),
        radius
    )
    gradient.addColorStop(0, `rgb(${innerColor})`)
    gradient.addColorStop(0.2, `rgb(${outerColor})`)
    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`)
    ctx.fillStyle = gradient
    ctx.arc(x, y, radius, Math.PI * 2, false)

    ctx.fill()
}

function sway (amount) {
    return Math.sin(amount * Math.PI * 2)
}

function toByte (num) {
    return Math.min(
        255,
        Math.max(
            0,
            Math.round(num)
        )
    )
}
