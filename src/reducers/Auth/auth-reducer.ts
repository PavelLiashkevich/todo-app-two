import { Dispatch } from 'redux'
import {
	SetIsInitializedType,
	SetStatusLoadingType,
	setIsInitializedAC,
	setStatusLoadingAC,
} from '../App/app-reducer'
import { LoginParamsType, authApi } from '../../api/auth-api'
import { ResultCode } from '../../api/todolist-api'
import {
	handleServerNetworkError,
	serverNetworkError,
} from '../../utils/error-utils'
import { clearTodolistsDataAC } from '../Todolists/todolists-reducer'
import { clearTasksDataAC } from '../Tasks/tasks-reducer'

const initialState = {
	isLoggedIn: false,
}

type InitialStateType = typeof initialState

export const authReducer = (
	state: InitialStateType = initialState,
	action: ActionsType
): InitialStateType => {
	switch (action.type) {
		case 'login/SET-IS-LOGGED-IN':
			return { ...state, isLoggedIn: action.value }
		default:
			return state
	}
}

// ========================== TYPES ==========================

type ActionsType =
	| IsLoggedActionType
	| SetStatusLoadingType
	| SetIsInitializedType

// ========================== ACTIONS ==========================

type IsLoggedActionType = ReturnType<typeof setIsLoggedInAC>

export const setIsLoggedInAC = (value: boolean) =>
	({ type: 'login/SET-IS-LOGGED-IN', value }) as const

// ========================== THUNKS ==========================

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
	dispatch(setStatusLoadingAC('loading'))
	authApi
		.login(data)
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(setIsLoggedInAC(true))
				dispatch(setStatusLoadingAC('success'))
			} else {
				serverNetworkError(dispatch, res.data)
			}
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
}

export const meTC = () => (dispatch: Dispatch) => {
	dispatch(setStatusLoadingAC('loading'))
	authApi
		.me()
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(setIsLoggedInAC(true))
				dispatch(setStatusLoadingAC('success'))
			} else {
				serverNetworkError(dispatch, res.data)
			}
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
		.finally(() => {
			dispatch(setIsInitializedAC(true))
		})
}

export const LogOutTC = () => (dispatch: Dispatch) => {
	authApi
		.logout()
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(setIsLoggedInAC(false))
				dispatch(setStatusLoadingAC('success'))
				dispatch(clearTodolistsDataAC())
				dispatch(clearTasksDataAC())
			} else {
				serverNetworkError(dispatch, res.data)
			}
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
}
