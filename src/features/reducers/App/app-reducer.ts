import { PayloadAction, UnknownAction, createSlice } from '@reduxjs/toolkit'

export type RequestStatusType = 'idle' | 'loading' | 'success' | 'error'

// ================================================

const initialState = {
	status: 'loading' as RequestStatusType,
	error: null as null | string,
	isInitialized: false,
}

const slice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setStatus: (
			state,
			action: PayloadAction<{ status: RequestStatusType }>
		) => {
			state.status = action.payload.status
		},
		setError: (state, action: PayloadAction<{ error: null | string }>) => {
			state.error = action.payload.error
		},
		setIsInitialized: (
			state,
			action: PayloadAction<{ isInitialized: boolean }>
		) => {
			state.isInitialized = action.payload.isInitialized
		},
	},
	extraReducers: builder => {
		builder
			.addMatcher(
				(action: UnknownAction) => {
					return action.type.endsWith('/pending')
				},
				(state, action) => {
					state.status = 'loading' as RequestStatusType
				}
			)
			.addMatcher(
				(action: UnknownAction) => {
					return action.type.endsWith('/fulfilled')
				},
				(state, action) => {
					state.status = 'success'
				}
			)
			.addMatcher(
				(action: UnknownAction) => {
					return action.type.endsWith('/rejected')
				},
				(state, action) => {
					state.status = 'error'
				}
			)
	},
	selectors: {
		selectStatus: state => state.status,
		selectError: state => state.error,
		selectIsInitialized: state => state.isInitialized,
	},
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const { selectStatus, selectError, selectIsInitialized } =
	slice.selectors
