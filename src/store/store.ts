import { combineReducers, compose, createStore, legacy_createStore } from 'redux'
import { tasksReducer } from '../reducers/Tasks/tasks-reducer'
import { todolistsReducer } from '../reducers/Todolists/todolists-reducer'

export type AppRootStateType = ReturnType<typeof rootReducer>

export const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
})

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = legacy_createStore(rootReducer, composeEnhancers())

// @ts-ignore
window.store = store
