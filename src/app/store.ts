import { UnknownAction, combineReducers } from "redux"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { ThunkDispatch } from "redux-thunk"
import { configureStore } from "@reduxjs/toolkit"

import { authReducer } from "features/auth/model/auth-reducer"
import { appReducer } from "../features/reducers/App/app-reducer"
import { tasksReducer } from "features/reducers/Tasks/tasks-reducer"
import { todolistsReducer } from "features/reducers/Todolists/todolists-reducer"

export type AppRootStateType = ReturnType<typeof rootReducer>

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

//========= start ========= useDispatch/useSelector =====================
export type AppDispatchType = ThunkDispatch<
  AppRootStateType,
  unknown,
  UnknownAction
>

export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector
//========= end ========= useDispatch/useSelector =======================

//const middlewareEnhancer = applyMiddleware(thunk)

//const composeWithDevTools =
//	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

//const composedEnhancers = composeWithDevTools(middlewareEnhancer)

//export const store = legacy_createStore(rootReducer, composedEnhancers)

export const store = configureStore({ reducer: rootReducer })

// @ts-ignore
window.store = store
