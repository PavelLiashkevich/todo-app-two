export type RequestStatusType = 'idle' | 'loading' | 'success' | 'error'

export type SetStatusLoadingType = ReturnType<typeof setStatusLoading>

const initialState = {
	status: 'loading' as RequestStatusType,
	error: null 
}

export const setStatusLoading = (status: any) => ({type: 'APP/SET_STATUS', status})
//export const setStatusError = (status: any) => ({type: 'APP/SET_ERROR', error})

type InitialStateType = typeof initialState

type ActionsTypes = SetStatusLoadingType

export const appReducer = (
	state: InitialStateType = initialState,
	action: ActionsTypes
) => {
	switch (action.type) {
		case 'APP/SET_STATUS': {
			return { ...state, status: action.status }
		}
		//case 'APP/SET_ERROR': {
		//	return { ...state, error: action.error }
		//}
		default:
			return { ...state }
	}
}
