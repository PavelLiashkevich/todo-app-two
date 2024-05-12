type initialStateType = {
	//происходит ли взаимодествие с сервером
	status: 'idle' | 'loading' | 'success' | 'error'
	// если взаимодействие с сервером не прошло - запишем текст об ошибке
	error: string | null
}

type ActionsTypes = any

const initialState: initialStateType = {
	status: 'idle',
	error: null,
}

export const appReducer = (
	state: initialStateType = initialState,
	action: ActionsTypes
) => {
	switch (action.type) {
		case 'SET_STATUS': {
			return { ...state, status: action.status }
		}
		case 'SET_ERROR': {
			return { ...state, error: action.error }
		}
		default:
			return { ...state }
	}
}
