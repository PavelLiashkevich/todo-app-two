import { Dispatch } from "redux"
import { ResponseType  } from  "../type/ResponseType"
import { appActions } from "features/reducers/App/app-reducer"

// generic function
export const handleServerAppError = <T>(
  dispatch: Dispatch,
  data: ResponseType<T>
) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setError({ error: "Some error occurred" }))
  }
  dispatch(appActions.setStatus({ status: "error" }))
}
