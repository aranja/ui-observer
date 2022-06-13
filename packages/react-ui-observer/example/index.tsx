import React from 'react'
import { render } from 'react-dom'
import { Example } from './scroll.example'

const App = () => {
  return (
    <div>
      <Example />
    </div>
  )
}

render(<App />, document.getElementById('root')!)
