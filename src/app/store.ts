import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { appReducer } from '../features/reducers/App/app-reducer'
import { authReducer } from 'features/auth/model/auth-reducer'
import { todolistsReducer } from 'features/reducers/Todolists/todolists-reducer'
import { tasksReducer } from 'features/reducers/Tasks/tasks-reducer'

export const store = configureStore({
	reducer: {
		tasks: tasksReducer,
		todolists: todolistsReducer,
		app: appReducer,
		auth: authReducer,
	},
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

//========= start ========= useDispatch/useSelector =====================

export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
	useSelector

//========= end ========= useDispatch/useSelector =======================

//========= Redux ======= combineReducers / middleware / redux-devtools ===============

//export const rootReducer = combineReducers({
//  tasks: tasksReducer,
//  todolists: todolistsReducer,
//  app: appReducer,
//  auth: authReducer,
//})

//const middlewareEnhancer = applyMiddleware(thunk)

//const composeWithDevTools =
//	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

//const composedEnhancers = composeWithDevTools(middlewareEnhancer)

//export const store = legacy_createStore(rootReducer, composedEnhancers)

// @ts-ignore
//window.store = store
