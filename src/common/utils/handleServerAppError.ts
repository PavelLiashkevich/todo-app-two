import { Dispatch } from 'redux'
import { BaseResponse } from '../types/BaseResponse'
import { appActions } from 'features/reducers/App/app-reducer'

/**
 * This function handles server app errors by dispatching appropriate actions.
 * It checks if there are any error messages in the data, and if so, it dispatches
 * an action to set the error message. If there are no error messages, it dispatches
 * a generic error message. Regardless, it also dispatches an action to set the app status to 'error'.
 *
 * @template T - The type of data expected in the BaseResponse.
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @param {BaseResponse<T>} data - The data containing the server response and potential error messages.
 * @returns {void} - This function does not return a value.
 */

export const handleServerAppError = <T>(
	dispatch: Dispatch,
	data: BaseResponse<T>
): void => {
	if (data.messages.length) {
		dispatch(appActions.setError({ error: data.messages[0] }))
	} else {
		dispatch(appActions.setError({ error: 'Some error occurred' }))
	}
	dispatch(appActions.setStatus({ status: 'error' }))
}
