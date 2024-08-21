import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ResultCode, TodolistType, todolistApi } from 'api/todolist-api'
import { RequestStatusType, appActions } from '../App/app-reducer'

import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'

const slice = createSlice({
	name: 'todolists',
	initialState: [] as TodolistDomainType[],
	reducers: {
		changeEntityStatus: (
			state,
			action: PayloadAction<{
				todolistId: string
				entityStatus: RequestStatusType
			}>
		) => {
			const index = state.findIndex(
				todo => todo.id === action.payload.todolistId
			)
			if (index !== -1) {
				state[index].entityStatus = action.payload.entityStatus
			}
		},
		changeFilter: (
			state,
			action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>
		) => {
			const index = state.findIndex(
				todo => todo.id === action.payload.todolistId
			)
			if (index !== -1) {
				state[index].filter = action.payload.filter
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(setTodolists.fulfilled, (state, action) => {
				action.payload.todolists.map(todolist => {
					state.push({
						...todolist,
						filter: 'all',
						entityStatus: 'idle',
					})
				})
			})
			.addCase(addTodolists.fulfilled, (state, action) => {
				state.unshift({
					...action.payload.todolist,
					filter: 'all',
					entityStatus: 'idle',
				})
			})
			.addCase(removeTodolists.fulfilled, (state, action) => {
				const index = state.findIndex(
					todo => todo.id === action.payload?.todolistId
				)
				if (index !== -1) {
					state.splice(index, 1)
				}
			})
			.addCase(changeTodolistsTitle.fulfilled, (state, action) => {
				const index = state.findIndex(
					todo => todo.id === action.payload.todolistId
				)
				if (index !== -1) {
					state[index].title = action.payload.newValue
				}
			})
			.addCase(clearTasksAndTodolistsData, (state, action) => {
				return action.payload.todolists
			})
	},
})

// ========================== TYPES ==========================

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}

// ========================== THUNKS ==========================

export const setTodolists = createAppAsyncThunk(
	`${slice.name}/setTodolists`,
	async (param, thunkApi) => {
		const { dispatch, rejectWithValue } = thunkApi

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await todolistApi.getTodolists()
			dispatch(appActions.setStatus({ status: 'success' }))
			return { todolists: res.data }
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const removeTodolists = createAppAsyncThunk(
	`${slice.name}/removeTodolists`,
	async (todolistId: string, thunkApi) => {
		const { dispatch, rejectWithValue } = thunkApi

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			dispatch(
				todolistsActions.changeEntityStatus({
					todolistId: todolistId,
					entityStatus: 'loading',
				})
			)

			const res = await todolistApi.deleteTodolist(todolistId)

			if (res) {
				dispatch(appActions.setStatus({ status: 'success' }))
				return { todolistId }
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			dispatch(
				todolistsActions.changeEntityStatus({
					todolistId,
					entityStatus: 'idle',
				})
			)
			return rejectWithValue(null)
		}
	}
)

export const addTodolists = createAppAsyncThunk(
	`${slice.name}/addTodolists`,
	async (title: string, thunkApi) => {
		const { dispatch, rejectWithValue } = thunkApi

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await todolistApi.createTodolist(title)
			dispatch(appActions.setStatus({ status: 'success' }))

			if (res.data.resultCode === ResultCode.SUCCESS) {
				return { todolist: res.data.data.item }
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue(null)
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const changeTodolistsTitle = createAppAsyncThunk(
	`${slice.name}/changeTodolistsTitle`,
	async (param: { todolistId: string; newValue: string }, thunkApi) => {
		const { dispatch, rejectWithValue } = thunkApi

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			await todolistApi.updateTodolistTitle(param.todolistId, param.newValue)
			dispatch(appActions.setStatus({ status: 'success' }))
			return { todolistId: param.todolistId, newValue: param.newValue }
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { removeTodolists, changeTodolistsTitle }
