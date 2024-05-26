import { Dispatch } from 'redux'
import { ResponseType } from '../api/task-api'
import { appActions } from '../reducers/App/app-reducer'

// generic function
export const serverNetworkError = <T>(
	dispatch: Dispatch,
	data: ResponseType<T>
) => {
	if (data.messages.length) {
		dispatch(appActions.setError({ error: data.messages[0] }))
	} else {
		dispatch(appActions.setError({ error: 'Some error occurred' }))
	}
	dispatch(appActions.setStatus({ status: 'error' }))
}

export const handleServerNetworkError = (
	dispatch: Dispatch,
	error: { message: string }
) => {
	dispatch(appActions.setError({ error: error.message }))
	dispatch(appActions.setStatus({ status: 'error' }))
}
