import axios from 'axios'
import { AppDispatchType } from 'app/store'
import { appActions } from 'features/reducers/App/app-reducer'

/**
 * This function handles server network errors by dispatching appropriate actions.
 * It extracts the error message from the error object, which could be an Axios error,
 * a native JavaScript error, or an unknown error. It then dispatches actions to set
 * the error message and the app status to 'error'.
 *
 * @param {AppDispatchType} dispatch - The Redux dispatch function.
 * @param {unknown} err - The error object containing information about the network error.
 * @returns {void} - This function does not return a value.
 */

export const handleServerNetworkError = (
	dispatch: AppDispatchType,
	err: unknown
): void => {
	let errorMessage = 'Some error occurred'

	if (axios.isAxiosError(err)) {
		errorMessage = err.response?.data?.message || err?.message || errorMessage
	} else if (err instanceof Error) {
		errorMessage = `Native error: ${err.message}`
	} else {
		errorMessage = JSON.stringify(err)
	}

	dispatch(appActions.setError({ error: errorMessage }))
}
