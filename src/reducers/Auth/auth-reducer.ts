import { Dispatch } from 'redux'
import { setIsInitializedAC, setStatusLoadingAC } from '../App/app-reducer'
import { LoginParamsType, authApi } from '../../api/auth-api'
import { ResultCode } from '../../api/todolist-api'
import {
	handleServerNetworkError,
	serverNetworkError,
} from '../../utils/error-utils'
import { clearTodolistsDataAC } from '../Todolists/todolists-reducer'
import { clearTasksDataAC } from '../Tasks/tasks-reducer'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
	},
	reducers: {
		setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
			state.isLoggedIn = action.payload.isLoggedIn
		},
	},
})

export const authReducer = slice.reducer
export const authActions = slice.actions

// ========================== THUNKS ==========================

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
	dispatch(setStatusLoadingAC('loading'))
	authApi
		.login(data)
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				// dispatch(setIsLoggedInAC(true))
				dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
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
				dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
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
				dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
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
