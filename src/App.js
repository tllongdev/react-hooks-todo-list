import React, { useReducer, useContext, useEffect, useRef } from 'react'
import './App.css'

function appReducer(state, action) {
  switch (action.type) {
    case 'reset': {
      return action.payload
    }
    case 'add': {
      return [
        ...state,
        {
          id: Date.now(),
          text: '',
          completed: false,
        },
      ]
    }
    case 'delete': {
      return state.filter(item => item.id !== action.payload)
    }
    case 'completed': {
      return state.map(item =>
        item.id === action.payload
          ? { ...item, completed: !item.completed }
          : item
      )
    }
    case 'update': {
      return state.map(item =>
        item.id === action.payload ? { ...item, text: action.text } : item
      )
    }
    default:
      return state
  }
}

const Context = React.createContext()

function useEffectOnce(cb) {
  const didRun = useRef(false)

  useEffect(() => {
    if (!didRun.current) {
      cb()
      didRun.current = true
    }
  })
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, [])

  useEffectOnce(() => {
    const raw = localStorage.getItem('data')
    dispatch({ type: 'reset', payload: JSON.parse(raw) })
  })

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(state))
  }, [state])

  return (
    <Context.Provider value={dispatch}>
      <div className={'App'}>
        <h1>Todos App</h1>
        <button onClick={() => dispatch({ type: 'add' })}>New Todo</button>
        <br />
        <br />
        <TodosList items={state} />
      </div>
    </Context.Provider>
  )
}

function TodosList({ items }) {
  return items.map(item => <TodoItem key={item.id} {...item} />)
}

function TodoItem({ id, completed, text }) {
  const dispatch = useContext(Context)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <input
        type='checkbox'
        checked={completed}
        onChange={() => dispatch({ type: 'completed', payload: id })}
      />
      <input
        type='text'
        // defaultValue={text}
        value={text}
        onChange={e =>
          dispatch({ type: 'update', payload: id, text: e.target.value })
        }
      />
      <button onClick={() => dispatch({ type: 'delete', payload: id })}>
        Delete
      </button>
      {id}
    </div>
  )
}
