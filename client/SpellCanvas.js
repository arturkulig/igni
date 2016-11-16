import React from 'react'
import range from '../common/range'

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
        color: React.PropTypes.string,
        colorTweenTime: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            points: [],
            maxSize: 45,
            maxAge: 1000,
            color: '255, 255, 255',
            colorTweenTime: 1000
        }
    },

    componentWillMount () {
        setInterval(() => {
            console.log('drawn', this.props.points.length, 'in', frames)
            frames = 0
        }, 1000)
    },

    componentWillReceiveProps (nextProps) {
        if (this.props.color !== nextProps.color) {
            this.lastColorChange = Date.now()
        }
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

        const now = Date.now()
        this.ages = this.ages || []

        const { width, height } = this.canvas.parentNode.getBoundingClientRect()
        this.canvas.width = width
        this.canvas.height = height * HEIGHT_SCALE
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = "screen";
        const rgb = this.props.color
            .split(',')
            .map(s => parseInt(s, 10))
        this.lastDrawnColor = this.lastDrawnColor || rgb
        let changingColor = false
        if (rgb[0] !== this.lastDrawnColor[0]) {
            rgb[0] = (
                this.lastDrawnColor[0] * Math.max(0, this.props.colorTweenTime + this.lastColorChange - now) / this.props.colorTweenTime +
                rgb[0] * (1 - Math.max(0, this.props.colorTweenTime + this.lastColorChange - now) / this.props.colorTweenTime)
            )
            changingColor = true
        }
        if (rgb[1] !== this.lastDrawnColor[1]) {
            rgb[1] = (
                this.lastDrawnColor[1] * Math.max(0, this.props.colorTweenTime + this.lastColorChange - now) / this.props.colorTweenTime +
                rgb[1] * (1 - Math.max(0, this.props.colorTweenTime + this.lastColorChange - now) / this.props.colorTweenTime)
            )
            changingColor = true
        }
        if (rgb[2] !== this.lastDrawnColor[2]) {
            rgb[2] = (
                this.lastDrawnColor[2] * Math.max(0, this.props.colorTweenTime + this.lastColorChange - now) / this.props.colorTweenTime +
                rgb[2] * (1 - Math.max(0, this.props.colorTweenTime + this.lastColorChange - now) / this.props.colorTweenTime)
            )
            changingColor = true
        }
        this.lastDrawnColor = rgb
        for (let i = 0; i < this.props.points.length; i++) {
            if (!(this.props.points[i] instanceof Array)) {
                continue
            }

            const [x, y] = this.props.points[i]
            if (this.ages[i] === undefined) {
                this.ages[i] = now - Math.random() * this.props.maxAge
            }
            // 0-maxAge
            const maxAge = this.props.maxAge + Math.round(this.props.maxAge * 0.75 * sway(i / 10))
            const age = Math.floor((now - this.ages[i]) % maxAge) / maxAge
            const sizeVariation = this.props.maxSize * sway(i / 10)
            if (changingColor) {
                drawSpark(this.ctx, x, y * HEIGHT_SCALE, rgb, age, this.props.maxSize + sizeVariation / 2)
            } else {
                const size = this.props.maxSize * 2 + sizeVariation
                this.ctx.drawImage(
                    getSparkCanvas(rgb, age, this.props.maxSize),
                    x - size / 2,
                    HEIGHT_SCALE * y - size / 2,
                    size,
                    size
                )
            }
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

function flatten (collections) {
    let result = []
    collections.forEach(collection => {
        result = result.concat(collection)
    })
    return result
}

function getSparkCanvas (/*byte[3]*/ color, /* 0-1 */ age, size) {
    const normalizedAge = Math.round(age * 1000) / 1000
    getSparkCanvas.cache = getSparkCanvas.cache || {}
    const sparkID = `${color},${normalizedAge},${size}`
    if (getSparkCanvas.cache[sparkID]) {
        return getSparkCanvas.cache[sparkID]
    }
    const spark = window.document.createElement('canvas')
    spark.width = spark.height = size * 2
    const ctx = spark.getContext('2d')
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, spark.width, spark.height);
    drawSpark(ctx, size, size, color, normalizedAge, size)
    getSparkCanvas.cache[sparkID] = spark
    return spark
}

function drawSpark (ctx, x, y, /*byte[3]*/ color, /* 0-1 */ age, size) {
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
        y + sway(age) * radius / 8, 
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
