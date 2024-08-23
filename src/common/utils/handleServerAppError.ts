import { Dispatch } from 'redux'
import { BaseResponse } from '../types/BaseResponse'
import { appActions } from 'features/reducers/App/app-reducer'

/**
 * This function handles server app errors by dispatching an action to set the error message,
 * if the `showError` flag is set to true. It checks if there are any error messages in the data,
 * and if so, it dispatches an action to set the error message to the first error message in the array.
 * If there are no error messages, it dispatches a generic error message.
 *
 * @template T - The type of data expected in the BaseResponse.
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @param {BaseResponse<T>} data - The data containing the server response and potential error messages.
 * @param {boolean} [showError=true] - A flag indicating whether to dispatch the error message action.
 * @returns {void} - This function does not return a value.
 */

export const handleServerAppError = <T>(
	dispatch: Dispatch,
	data: BaseResponse<T>,
	showError: boolean = true
): void => {
	if (showError) {
		dispatch(
			appActions.setError({
				error: data.messages.length ? data.messages[0] : 'Some error occurred',
			})
		)
	}
}
