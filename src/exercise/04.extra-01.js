// Prop Collections and Getters
// Exercise 4 Extra Credit 1

import * as React from 'react'
import {Switch} from '../switch'

// Extra Credit
// 1. 💯 prop getters
// Uh oh! Someone wants to use our togglerProps object, but they need to apply their
// own onClick handler! Try doing that by updating the App component to this:

// function App() {
//   const {on, togglerProps} = useToggle()
//   return (
//     <div>
//       <Switch on={on} {...togglerProps} />
//       <hr />
//       <button
//         aria-label="custom-button"
//         {...togglerProps}
//         onClick={() => console.info('onButtonClick')}
//       >
//         {on ? 'on' : 'off'}
//       </button>
//     </div>
//   )
// }

// Does that work? Why not? Can you change it to make it work?

// What if we change the API slightly so that instead of having an object of props,
// we call a function to get the props. Then we can pass that function the props we want
// applied and that function will be responsible for composing the props together.

// Let’s try that. Update the App component to this:

// function App() {
//   const {on, getTogglerProps} = useToggle()
//   return (
//     <div>
//       <Switch {...getTogglerProps({on})} />
//       <hr />
//       <button
//         {...getTogglerProps({
//           'aria-label': 'custom-button',
//           onClick: () => console.info('onButtonClick'),
//           id: 'custom-button-id',
//         })}
//       >
//         {on ? 'on' : 'off'}
//       </button>
//     </div>
//   )
// }
// See if you can make that API work.

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  const getTogglerProps = ({onClick, ...props} = {}) => {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  return {on, toggle, getTogglerProps}
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App
