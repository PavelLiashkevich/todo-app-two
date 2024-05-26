import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
})

export const appReducer = slice.reducer
export const appActions = slice.actions
