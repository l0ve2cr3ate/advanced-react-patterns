// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {Switch} from '../switch'

// Exercise
// The fundamental difference between this exercise and the last one is that now we’re 
// going to allow people to render the compound components wherever they like in the 
// render tree. Searching through props.children for the components to clone would be futile. 
// So we’ll use context instead.

// Your job will be to make the ToggleContext which will be used to implicitly share the state 
// between these components, and then a custom hook to consume that context for the compound 
// components to do their job.

const ToggleContext = React.createContext()

function Toggle({onToggle, children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

return (
  <ToggleContext.Provider value={{on, toggle}}>
    {children}
  </ToggleContext.Provider>
)
}

const useToggle = () => React.useContext(ToggleContext)

function ToggleOn({children}) {
  const {on} = useToggle()
  return on ? children : null
}

function ToggleOff({children}) {
  const {on} = useToggle()
  return on ? null : children
}

function ToggleButton({...props}) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/

// Extra Credit
// 1. 💯 custom hook validation
// Change the App function to this:

// const App = () => <ToggleButton />
// Why doesn’t that work? Can you figure out a way to give the developer a better error message?