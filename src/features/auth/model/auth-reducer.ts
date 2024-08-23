import {
	createSlice,
	isAnyOf,
	PayloadAction,
	UnknownAction,
} from '@reduxjs/toolkit'
import { appActions } from '../../reducers/App/app-reducer'

import { authApi } from '../api/auth-api'
import { LoginParamsType } from '../api/auth-api.types'
import { ResultCode } from 'api/todolist-api'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'

const slice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
	},
	reducers: {},
	selectors: {
		selectIsLoggedIn: state => state.isLoggedIn,
	},
	extraReducers: builder => {
		builder.addMatcher(
			isAnyOf(login.fulfilled, logout.fulfilled, me.fulfilled),
			(state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
				state.isLoggedIn = action.payload.isLoggedIn
			}
		)
	},
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const { selectIsLoggedIn } = slice.selectors

// ========================== THUNKS ==========================

export const login = createAppAsyncThunk<
	{ isLoggedIn: boolean },
	LoginParamsType
>(`${slice.name}/login`, async (param, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI

	try {
		dispatch(appActions.setStatus({ status: 'loading' }))
		const res = await authApi.login(param)
		if (res.data.resultCode === ResultCode.SUCCESS) {
			dispatch(appActions.setStatus({ status: 'success' }))
			return { isLoggedIn: true }
		} else {
			handleServerAppError(dispatch, res.data)
			return rejectWithValue(res.data)
		}
	} catch (error) {
		handleServerNetworkError(dispatch, error)
		return rejectWithValue(null)
	}
})

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
	`${slice.name}/logout`,
	async (_, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await authApi.logout()

			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(clearTasksAndTodolistsData({ todolists: [], tasks: {} }))
				dispatch(appActions.setStatus({ status: 'success' }))
				return { isLoggedIn: false }
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue(null)
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
	`${slice.name}/me`,
	async (_, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await authApi.me()

			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				return { isLoggedIn: true }
			} else {
				dispatch(appActions.setStatus({ status: 'success' }))

				//handleServerAppError(dispatch, res.data)
				return rejectWithValue(null)
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		} finally {
			dispatch(appActions.setIsInitialized({ isInitialized: true }))
		}
	}
)
