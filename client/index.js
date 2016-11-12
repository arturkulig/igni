import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import './index.scss'

const container = window.document.createElement('div')
container.id = 'react-app'
window.document.body.appendChild(container)

ReactDOM.render(<App />, container)
