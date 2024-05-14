export type RequestStatusType = 'idle' | 'loading' | 'success' | 'error'

// ================================================
type InitialStateType = typeof initialState

const initialState = {
	status: 'loading' as RequestStatusType,
	error: null as null | string,
}
// ================================================

type ActionsTypes = SetStatusLoadingType | SetStatusErrorType

export const appReducer = (
	state: InitialStateType = initialState,
	action: ActionsTypes
) => {
	switch (action.type) {
		case 'APP/SET-STATUS': {
			return { ...state, status: action.status }
		}
		case 'APP/SET-ERROR': {
			return { ...state, error: action.error }
		}
		default:
			return state
	}
}

// ================================================

export type SetStatusLoadingType = ReturnType<typeof setStatusLoading>

export const setStatusLoading = (status: RequestStatusType) =>
	({
		type: 'APP/SET-STATUS',
		status,
	}) as const

// ================================================

export type SetStatusErrorType = ReturnType<typeof setStatusError>

export const setStatusError = (error: null | string) =>
	({ type: 'APP/SET-ERROR', error }) as const
