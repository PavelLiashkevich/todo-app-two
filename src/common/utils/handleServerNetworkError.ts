import { appActions } from "features/reducers/App/app-reducer"
import { AppDispatchType } from "app/store"
import axios from "axios"

export const handleServerNetworkError = (
  dispatch: AppDispatchType,
  err: unknown
): void => {
  let errorMessage = "Some error occurred"

  // ❗ Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setError({ error: errorMessage }))
  dispatch(appActions.setStatus({ status: "error" }))
}
