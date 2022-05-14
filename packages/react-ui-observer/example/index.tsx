import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Example } from './scroll.example'

const App = () => {
  return (
    <div>
      <Example />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
