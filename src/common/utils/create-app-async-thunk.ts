import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppRootStateType, AppDispatchType } from 'app/store'
import { BaseResponse } from 'common/types/BaseResponse'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: AppRootStateType
	dispatch: AppDispatchType
	rejectValue: null | BaseResponse
}>()
