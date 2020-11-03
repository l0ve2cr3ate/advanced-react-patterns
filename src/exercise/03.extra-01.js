// Flexible Compound Components
// Exercise 3 Extra Credit 2

import * as React from 'react'
import {Switch} from '../switch'

//Extra Credit
// 1. 💯 custom hook validation
// Change the App function to this:

// const App = () => <ToggleButton />
// Why doesn’t that work? Can you figure out a way to give the developer a better error message?

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

const useToggle = () => {
  const context = React.useContext(ToggleContext)
  if (context === undefined) {
    throw new Error('useToggle should be used within a <Toggle /> component')
  }
  return context
}

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

const App = () => <ToggleButton />

export default App
