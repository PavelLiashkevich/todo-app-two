import { AxiosError } from 'axios'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { appActions } from '../../reducers/App/app-reducer'

import { authApi } from '../api/auth-api'
import { LoginParamsType } from '../api/auth-api.types'
import { ResultCode } from 'api/todolist-api'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'
import { FieldErrorType } from 'common/type/ResponseType'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'

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
	selectors: {
		selectIsLoggedIn: state => state.isLoggedIn,
	},
	extraReducers: builder => {
		builder.addCase(loginTC.fulfilled, (state, action) => {
			state.isLoggedIn = true
		})
		builder.addCase(logoutTC.fulfilled, state => {
			state.isLoggedIn = false
		})
		builder.addCase(meTC.fulfilled, state => {
			state.isLoggedIn = true
		})
	},
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const { selectIsLoggedIn } = slice.selectors

// ========================== THUNKS ==========================

export const loginTC = createAppAsyncThunk<
	undefined,
	LoginParamsType,
	{ rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] } }
>(`${slice.name}/loginTC`, async (param, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI

	dispatch(appActions.setStatus({ status: 'loading' }))

	try {
		const res = await authApi.login(param)
		if (res.data.resultCode === ResultCode.SUCCESS) {
			dispatch(appActions.setStatus({ status: 'success' }))
		} else {
			handleServerAppError(dispatch, res.data)
			return rejectWithValue({
				errors: res.data.messages,
				fieldsErrors: res.data.fieldsErrors,
			})
		}
	} catch (error) {
		if (error instanceof AxiosError) {
			const axiosError: AxiosError = error
			handleServerNetworkError(dispatch, error)
			return rejectWithValue({
				errors: [axiosError.message],
				fieldsErrors: undefined,
			})
		}
	}
})

export const logoutTC = createAppAsyncThunk(
	`${slice.name}/logoutTC`,
	async (param, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI

		dispatch(appActions.setStatus({ status: 'loading' }))

		try {
			const res = await authApi.logout()

			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				dispatch(clearTasksAndTodolistsData({ todolists: [], tasks: {} }))
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

export const meTC = createAppAsyncThunk(
	`${slice.name}/meTC`,
	async (param, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		
		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await authApi.me()

			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
				dispatch(appActions.setStatus({ status: 'success' }))
			} else {
				handleServerAppError(dispatch, res.data)
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
