import { Dispatch } from 'redux'
import { ResponseType } from '../api/task-api'
import { setStatusErrorAC, setStatusLoadingAC } from '../reducers/App/app-reducer'

//type ErrorUtilsDispatchType = Dispatch<
//	SetAppErrorActionType | SetAppStatusActionType
//>

// generic function
export const serverNetworkError = <T>(
	dispatch: Dispatch,
	data: ResponseType<T>,
) => {
	if (data.messages.length) {
		dispatch(setStatusErrorAC(data.messages[0]))
	} else {
		dispatch(setStatusErrorAC('Some error occurred'))
	}
	dispatch(setStatusLoadingAC('error'))
}

export const handleServerNetworkError = (
	dispatch: Dispatch,
	error: { message: string },
) => {
	dispatch(setStatusErrorAC(error.message))
	dispatch(setStatusLoadingAC('error'))
}
