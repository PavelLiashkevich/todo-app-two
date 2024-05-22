import {
	UnknownAction,
	applyMiddleware,
	combineReducers,
	compose,
	legacy_createStore,
} from 'redux'
import { tasksReducer } from '../reducers/Tasks/tasks-reducer'
import { todolistsReducer } from '../reducers/Todolists/todolists-reducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch, thunk } from 'redux-thunk'
import { appReducer } from '../reducers/App/app-reducer'
import { authReducer } from '../reducers/Auth/auth-reducer'

export type AppRootStateType = ReturnType<typeof rootReducer>

export const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
	app: appReducer,
	auth: authReducer,
})

//========= start ========= useDispatch/useSelector =====================
type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, UnknownAction>

export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
//========= end ========= useDispatch/useSelector =======================

const middlewareEnhancer = applyMiddleware(thunk)

const composeWithDevTools =
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const composedEnhancers = composeWithDevTools(middlewareEnhancer)

export const store = legacy_createStore(rootReducer, composedEnhancers)

// @ts-ignore
window.store = store
