// Compound Components Exercise 2 Extra Credit 1

import * as React from 'react'
import {Switch} from '../switch'

// Extra Credit
// 1. 💯 Support DOM component children
// A DOM component is a built-in component like <div />, <span />, or <blink />. A composite component is a custom component like <Toggle /> or <App />.

// Try updating the App to this:

// function App() {
//   return (
//     <div>
//       <Toggle>
//         <ToggleOn>The button is on</ToggleOn>
//         <ToggleOff>The button is off</ToggleOff>
//         <span>Hello</span>
//         <ToggleButton />
//       </Toggle>
//     </div>
//   )
// }
// Notice the error message in the console and try to fix it.

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children.map(children, child => {
    if (typeof child.type === 'string') {
      return child
    }
    return React.cloneElement(child, {
      on,
      toggle,
    })
  })
}

const ToggleOn = ({on, children}) => {
  if (on) {
    return <>{children}</>
  }
  return null
}

const ToggleOff = ({on, children}) => {
  if (!on) {
    return <>{children}</>
  }
  return null
}

const ToggleButton = ({on, toggle}) => <Switch on={on} onClick={toggle} />

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App
