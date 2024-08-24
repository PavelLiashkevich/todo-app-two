import {
	PayloadAction,
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from '@reduxjs/toolkit'
import { addTodolists } from '../Todolists'
import { addTask } from '../Tasks'

export type RequestStatusType = 'idle' | 'loading' | 'success' | 'error'

// ================================================

const initialState = {
	status: 'loading' as RequestStatusType,
	error: null as null | string | undefined,
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
			.addMatcher(isPending, state => {
				state.status = 'loading'
			})
			.addMatcher(isFulfilled, state => {
				state.status = 'success'
			})
			.addMatcher(isRejected(addTodolists, addTask), (state, action) => {
				state.status = 'error'
				if (action.type === addTodolists.rejected.type) return
				if (action.payload) {
					state.error = action.payload.messages[0]
				} else {
					state.error = action.error.message
						? action.error.message
						: 'Some error occurred'
				}
			})
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
