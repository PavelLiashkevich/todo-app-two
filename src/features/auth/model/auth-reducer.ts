import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit'
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
			isFulfilled(login, logout, me),
			(state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
				state.isLoggedIn = action.payload.isLoggedIn
			}
		)
	},
})

// ========================== THUNKS ==========================

export const login = createAppAsyncThunk<
	{ isLoggedIn: boolean },
	LoginParamsType
>(`${slice.name}/login`, async (param, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI

	const res = await authApi.login(param)
	if (res.data.resultCode === ResultCode.SUCCESS) {
		return { isLoggedIn: true }
	} else {
		handleServerAppError(dispatch, res.data)
		return rejectWithValue(res.data)
	}
})

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
	`${slice.name}/logout`,
	async (_, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI

		const res = await authApi.logout()

		if (res.data.resultCode === ResultCode.SUCCESS) {
			dispatch(clearTasksAndTodolistsData({ todolists: [], tasks: {} }))
			return { isLoggedIn: false }
		} else {
			handleServerAppError(dispatch, res.data)
			return rejectWithValue(res.data)
		}
	}
)

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
	`${slice.name}/me`,
	async (_, { dispatch, rejectWithValue }) => {
		const res = await authApi.me().finally(() => {
			dispatch(appActions.setIsInitialized({ isInitialized: true }))
			dispatch(appActions.setStatus({ status: 'success' }))
		})
		if (res.data.resultCode === ResultCode.SUCCESS) {
			return { isLoggedIn: true }
		} else {
			return rejectWithValue(res.data)
		}
	}
)

export const authReducer = slice.reducer
export const authActions = slice.actions
export const { selectIsLoggedIn } = slice.selectors
