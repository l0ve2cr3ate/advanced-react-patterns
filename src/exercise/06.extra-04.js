// Control Props
// Exercise 6 Extra Credit 4

import * as React from 'react'
import warning from 'warning'
import {Switch} from '../switch'

// 4. 💯 don’t warn in production
// Runtime warnings are helpful during development, but probably not useful in production.
// See if you can make this not warn in production.

// You can tell whether we’re running in production with process.env.NODE_ENV === 'production'

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

  const production = process.env.NODE_ENV === 'production'

  if (!production) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledSwitchWarning(controlledOn, 'on', 'useToggle')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useOnChangeReadOnlyWarning(
      hasOnChange,
      readOnly,
      controlledOn,
      'on',
      'useToggle',
      'onChange',
      'readOnly',
      'initialOn',
    )
  }

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

// 2. 💯 add a controlled state warning
// With that read-only warning in place, next try and add a warning for when
// the user changes from controlled to uncontrolled or vice-versa.
// (Passing a value for on and later passing undefined or null)

const useControlledSwitchWarning = (
  controlPropValue,
  controlPropName,
  componentName,
) => {
  const isControlled = controlPropValue != null
  let {current: wasControlled} = React.useRef(isControlled)

  React.useEffect(() => {
    warning(
      !(!isControlled && wasControlled),
      `${componentName} is changing from uncontrolled to controlled. Decide between using a controlled or uncontrolled element for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
    )
    warning(
      !(isControlled && !wasControlled),
      `${componentName} is changing an controlled component to be uncontrolled. Decide between using a controlled or uncontrolled element for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
    )
  }, [componentName, controlPropName, isControlled, wasControlled])
}

const useOnChangeReadOnlyWarning = (
  hasOnChange,
  readOnly,
  controlPropValue,
  controlPropName,
  componentName,
  onChangeProp,
  readOnlyProp,
  initialValueProp,
) => {
  const isControlled = controlPropValue != null

  React.useEffect(() => {
    const readOnlyMessage = !hasOnChange && isControlled && !readOnly
    warning(
      !readOnlyMessage,
      `Warning: You provided an ${controlPropName} prop to ${componentName} without an ${onChangeProp} handler. This will render a read-only ${componentName}. If the toggle should be mutable use ${initialValueProp}. Otherwise, set either ${onChangeProp} or ${readOnlyProp}`,
    )
  }, [
    readOnly,
    hasOnChange,
    isControlled,
    controlPropValue,
    controlPropName,
    componentName,
    initialValueProp,
    onChangeProp,
    readOnlyProp,
  ])
}
