import { Dispatch } from 'redux'
import { BaseResponse } from '../type/BaseResponse'
import { appActions } from 'features/reducers/App/app-reducer'

// generic function
export const handleServerAppError = <T>(
	dispatch: Dispatch,
	data: BaseResponse<T>
) => {
	if (data.messages.length) {
		dispatch(appActions.setError({ error: data.messages[0] }))
	} else {
		dispatch(appActions.setError({ error: 'Some error occurred' }))
	}
	dispatch(appActions.setStatus({ status: 'error' }))
}
