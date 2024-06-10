import { Dispatch } from 'redux'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { appActions } from '../../reducers/App/app-reducer'

import { authApi } from '../api/auth-api'
import { LoginParamsType } from '../api/auth-api.types'
import { ResultCode } from 'api/todolist-api'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'
import { AxiosError } from 'axios'
import { FieldErrorType } from 'common/type/ResponseType'

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
			state.isLoggedIn = action.payload.isLoggedIn
		})
	},
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authSelector = slice.selectors

// ========================== THUNKS ==========================

export const loginTC = createAsyncThunk<
{ isLoggedIn: boolean }, 
LoginParamsType, 
{ rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[] }}>(
	`${slice.name}/loginTC`,
	async (data: LoginParamsType, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		dispatch(appActions.setStatus({ status: 'loading' }))
		try {
			const res = await authApi.login(data)
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				return { isLoggedIn: true }
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
			}
		} catch (err) {
			const error: AxiosError = err
			handleServerNetworkError(dispatch, error)
			return rejectWithValue({ errors: [error], fieldsErrors: undefined })
		}
	}
)

export const meTC = () => (dispatch: Dispatch) => {
	dispatch(appActions.setStatus({ status: 'loading' }))
	authApi
		.me()
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
				dispatch(appActions.setStatus({ status: 'success' }))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
		.finally(() => {
			dispatch(appActions.setIsInitialized({ isInitialized: true }))
		})
}

export const LogOutTC = () => (dispatch: Dispatch) => {
	authApi
		.logout()
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
				dispatch(appActions.setStatus({ status: 'success' }))
				dispatch(clearTasksAndTodolistsData({ todolists: [], tasks: {} }))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
}
