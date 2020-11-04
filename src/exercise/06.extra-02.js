// Control Props
// Exercise 6 Extra Credit 2

import * as React from 'react'
import warning from 'warning'
import {Switch} from '../switch'

// 2. 💯 add a controlled state warning
// With that read-only warning in place, next try and add a warning for when
// the user changes from controlled to uncontrolled or vice-versa.
// (Passing a value for on and later passing undefined or null)

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
  const {current: controlledOnRef} = React.useRef(onIsControlled)

  React.useEffect(() => {
    warning(
      !(!controlledOnRef && onIsControlled),
      '`useToggle` is changing from uncontrolled to controlled. This is likely caused by the value changing from defined to an undefined value, which should not happen. Decide between using a controlled or uncontrolled element for the lifetime of the component.',
    )
    warning(
      !(controlledOnRef && !onIsControlled),
      '`useToggle` is changing an controlled component to be uncontrolled. This is likely caused by the value changing from defined to a undefined value, which should not happen. Decide between using a controlled or uncontrolled element for the lifetime of the component.',
    )
  }, [controlledOnRef, onIsControlled])

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
        <Toggle on={undefined} onChange={handleToggleChange} />
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
