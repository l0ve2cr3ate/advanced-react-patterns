// Control Props
// Exercise 6 Extra Credit 1

import * as React from 'react'
import warning from 'warning'
import {Switch} from '../switch'

// Extra Credit
// 1. 💯 add read only warning
// Take a look at the example in ./src/examples/warnings.js (you can pull it up at
// /isolated/examples/warnings.js).

// Notice the warnings when you click the buttons. You should see the following warnings
// all related to controlled inputs:
// Warning: Failed prop type: You provided a `value` prop to a form field without an
// `onChange` handler. This will render a read-only field. If the field should be
// mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
// Warning: A component is changing an uncontrolled input of type undefined to be controlled.
// Input elements should not switch from uncontrolled to controlled (or vice versa).
// Decide between using a controlled or uncontrolled input element for the lifetime of
// the component. More info: https://fb.me/react-controlled-components
// Warning: A component is changing a controlled input of type undefined to be uncontrolled.
// Input elements should not switch from controlled to uncontrolled (or vice versa).
// Decide between using a controlled or uncontrolled input element for the lifetime of
// the component. More info: https://fb.me/react-controlled-components

// We should issue the same warnings for people who misuse our controlled props:

// Passing on without onChange
// Passing a value for on and later passing undefined or null
// Passing undefined or null for on and later passing a value
// For this first extra credit, create a warning for the read-only situation (the other extra credits will handle the other cases).

// 💰 You can use the warning package to do this:
// warning(doNotWarn, 'Warning message')

// // so:
// warning(false, 'This will warn')
// warning(true, 'This will not warn')

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onIsControlled = controlledOn != null
  const on = onIsControlled ? controlledOn : state.on

  const hasOnChange = !!onChange

  React.useEffect(() => {
    const readOnlyMessage = !hasOnChange && onIsControlled && !readOnly
    warning(
      !readOnlyMessage,
      'Warning: You provided an `on` prop to useToggle hook without an `onChange` handler. This will render a read-only toggle. If the toggle should be mutable use `initialOn`. Otherwise, set either `onChange` or `readOnly`',
    )
  }, [readOnly, hasOnChange, onIsControlled])

  const dispatchWithOnChange = action => {
    if (!onIsControlled) {
      dispatch(action)
    }
    onChange?.(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange}) {
  const {on, getTogglerProps} = useToggle({on: controlledOn, onChange})
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
