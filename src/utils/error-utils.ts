import { Dispatch } from 'redux'
import { ResponseType } from '../api/task-api'
import { appActions } from '../reducers/App/app-reducer'
import { AppDispatchType } from 'store/store'
import axios from 'axios'

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

//export const handleServerNetworkError = (
//	dispatch: Dispatch,
//	error: { message: string }
//) => {
//	dispatch(appActions.setError({ error: error.message }))
//	dispatch(appActions.setStatus({ status: 'error' }))
//}

export const handleServerNetworkError = (
	dispatch: AppDispatchType,
	err: unknown
): void => {
	let errorMessage = 'Some error occurred'

	// ❗Проверка на наличие axios ошибки
	if (axios.isAxiosError(err)) {
		// ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
		// ⏺️ err?.message - например при создании таски в offline режиме
		errorMessage = err.response?.data?.message || err?.message || errorMessage
		// ❗ Проверка на наличие нативной ошибки
	} else if (err instanceof Error) {
		errorMessage = `Native error: ${err.message}`
		// ❗Какой-то непонятный кейс
	} else {
		errorMessage = JSON.stringify(err)
	}

	dispatch(appActions.setError({ error: errorMessage }))
	dispatch(appActions.setStatus({ status: 'error' }))
}
