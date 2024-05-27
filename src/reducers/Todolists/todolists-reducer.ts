import { ResultCode, TodolistType, todolistApi } from '../../api/todolist-api'
import { Dispatch } from 'redux'
import { RequestStatusType, appActions } from '../App/app-reducer'
import {
	handleServerNetworkError,
	serverNetworkError,
} from '../../utils/error-utils'
import { getTasksTC } from '../Tasks/tasks-reducer'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'todolists',
	initialState: [] as TodolistDomainType[],
	reducers: {
		addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
			{
				state.unshift({
					...action.payload.todolist,
					filter: 'all',
					entityStatus: 'idle',
				})
			}
		},
		removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
			const index = state.findIndex(
				todo => todo.id === action.payload.todolistId
			)
			if (index !== -1) {
				state.splice(index, 1)
			}
		},
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
		changeTodolistTitle: (
			state,
			action: PayloadAction<{ todolistId: string; newValue: string }>
		) => {
			const index = state.findIndex(
				todo => todo.id === action.payload.todolistId
			)
			if (index !== -1) {
				state[index].title = action.payload.newValue
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
		setTodolists: (
			state,
			action: PayloadAction<{ todolists: TodolistType[] }>
		) => {
			action.payload.todolists.forEach(todolist => {
				state.push({
					...todolist,
					filter: 'all',
					entityStatus: 'idle',
				})
			})
		},
		clearTodolistsData: (state) => {
			return []
		},
	},
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// ========================== TYPES ==========================

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}

// ========================== THUNKS ==========================

export const getTodosTC = () => (dispatch: any) => {
	dispatch(appActions.setStatus({ status: 'loading' }))
	todolistApi
		.getTodolists()
		.then(res => {
			dispatch(todolistsActions.setTodolists({ todolists: res.data }))
			dispatch(appActions.setStatus({ status: 'success' }))
			return res.data
		})
		.then(todolists => {
			todolists.forEach(todolist => {
				dispatch(getTasksTC(todolist.id))
			})
		})
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
	dispatch(appActions.setStatus({ status: 'loading' }))
	todolistApi
		.createTodolist(title)
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
			} else {
				serverNetworkError(dispatch, res.data)
			}
			dispatch(appActions.setStatus({ status: 'success' }))
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
}

export const removeTodolistTC =
	(todolistId: string) => (dispatch: Dispatch) => {
		dispatch(appActions.setStatus({ status: 'loading' }))
		dispatch(
			todolistsActions.changeEntityStatus({
				todolistId: todolistId,
				entityStatus: 'loading',
			})
		)
		todolistApi
			.deleteTodolist(todolistId)
			.then(() => {
				dispatch(appActions.setStatus({ status: 'success' }))
				dispatch(todolistsActions.removeTodolist({ todolistId }))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
				dispatch(
					todolistsActions.changeEntityStatus({
						todolistId,
						entityStatus: 'idle',
					})
				)
			})
	}

export const changeTodolistTitleTC =
	(todolistId: string, newValue: string) => (dispatch: Dispatch) => {
		dispatch(appActions.setStatus({ status: 'loading' }))
		todolistApi
			.updateTodolistTitle(todolistId, newValue)
			.then(() => {
				dispatch(todolistsActions.changeTodolistTitle({ todolistId, newValue }))
				dispatch(appActions.setStatus({ status: 'success' }))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
			})
	}
