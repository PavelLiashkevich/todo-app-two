import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppRootStateType, AppDispatchType } from 'store/store'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: AppRootStateType
	dispatch: AppDispatchType
	rejectValue: null
}>()
