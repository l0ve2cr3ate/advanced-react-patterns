// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

// In this exercise we’re going to make <Toggle /> the parent of a few compound components:

// <ToggleOn /> renders children when the on state is true
// <ToggleOff /> renders children when the on state is false
// <ToggleButton /> renders the <Switch /> with the on prop set to the on state and 
// the onClick prop set to toggle.
// We have a Toggle component that manages the state, and we want to render different 
// parts of the UI however we want. We want control over the presentation of the UI.

// 🦉 The fundamental challenge you face with an API like this is the state shared 
//between the components is implicit, meaning that the developer using your component 
// cannot actually see or interact with the state (on) or the mechanisms for updating 
// that state (toggle) that are being shared between the components.

// So in this exercise, we’ll solve that problem by providing the compound components 
// with the props they need implicitly using React.cloneElement.

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children.map(children, child => {
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
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/




