import { Dispatch } from "redux"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { appActions } from "../../reducers/App/app-reducer"

import { LoginParamsType, authApi } from "../api/auth-api"
import { ResultCode } from "api/todolist-api"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { clearTasksAndTodolistsData } from "common/actions/common-actions"
import { handleServerAppError } from "common/utils/handleServerAppError"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authSelector = slice.selectors

// ========================== THUNKS ==========================

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
        dispatch(appActions.setStatus({ status: "success" }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error)
    })
}

export const meTC = () => (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
        dispatch(appActions.setStatus({ status: "success" }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error)
    })
    .finally(() => {
      dispatch(appActions.setIsInitialized({ isInitialized: true }))
    })
}

export const LogOutTC = () => (dispatch: Dispatch) => {
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
        dispatch(appActions.setStatus({ status: "success" }))
        dispatch(clearTasksAndTodolistsData({ todolists: [], tasks: {} }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error)
    })
}
