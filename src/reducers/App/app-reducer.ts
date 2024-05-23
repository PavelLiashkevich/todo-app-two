export type RequestStatusType = 'idle' | 'loading' | 'success' | 'error'

// ================================================
type InitialStateType = typeof initialState

const initialState = {
	status: 'loading' as RequestStatusType,
	error: null as null | string,
	isInitialized: false,
}
// ================================================

type ActionsTypes =
	| SetStatusLoadingType
	| SetStatusErrorType
	| SetIsInitializedType

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

		case 'APP/SET-IS-INITIALIZED': {
			return { ...state, isInitialized: action.isInitialized }
		}
		default:
			return state
	}
}

// ================================================

export type SetStatusLoadingType = ReturnType<typeof setStatusLoadingAC>

export const setStatusLoadingAC = (status: RequestStatusType) =>
	({
		type: 'APP/SET-STATUS',
		status,
	}) as const

// ================================================

export type SetStatusErrorType = ReturnType<typeof setStatusErrorAC>

export const setStatusErrorAC = (error: null | string) =>
	({ type: 'APP/SET-ERROR', error }) as const

// ================================================

export type SetIsInitializedType = ReturnType<typeof setIsInitializedAC>

export const setIsInitializedAC = (isInitialized: boolean) =>
	({
		type: 'APP/SET-IS-INITIALIZED',
		isInitialized,
	}) as const
