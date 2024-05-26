import { v1 } from 'uuid'
import { ResultCode, TodolistType, todolistApi } from '../../api/todolist-api'
import { Dispatch } from 'redux'
import { RequestStatusType, appActions } from '../App/app-reducer'
import {
	handleServerNetworkError,
	serverNetworkError,
} from '../../utils/error-utils'
import { getTasksTC } from '../Tasks/tasks-reducer'

export let todolistID1 = v1()

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (
	state: TodolistDomainType[] = initialState,
	action: TodolistReducerType
): TodolistDomainType[] => {
	switch (action.type) {
		case 'ADD-TODOLIST': {
			return [
				{ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' },
				...state,
			]
		}

		case 'REMOVE-TODOLIST': {
			return state.filter(todolist => todolist.id !== action.payload.todolistId)
		}

		case 'CHANGE-ENTITY-STATUS': {
			return state.map(todolist =>
				todolist.id === action.payload.todolistId
					? { ...todolist, entityStatus: action.payload.entityStatus }
					: todolist
			)
		}

		case 'CHANGE-TODOLIST-TITLE': {
			return state.map(todolist =>
				todolist.id === action.payload.todolistId
					? { ...todolist, title: action.payload.newValue }
					: todolist
			)
		}

		case 'CHANGE-FILTER': {
			return state.map(todolist =>
				todolist.id === action.payload.todolistId
					? { ...todolist, filter: action.payload.value }
					: todolist
			)
		}

		case 'SET-TODOLISTS': {
			return action.todos.map(todolist => ({
				...todolist,
				order: todolist.order + 1,
				filter: 'all',
				entityStatus: 'idle',
			}))
		}

		case 'CLEAR-TODOLISTS-DATA': {
			return []
		}

		default: {
			return state
		}
	}
}

// ========================== TYPES ==========================

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}

type TodolistReducerType =
	| RemoveTodolistACType
	| AddTodolistACType
	| ChangeTodolistTitleACType
	| ChangeFilterACType
	| SetTodolistsType
	| SetEntityStatusType
	| ClearTodolistsData

// ========================== ACTIONS ==========================

export type AddTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (todolist: TodolistType) => {
	return {
		type: 'ADD-TODOLIST',
		payload: {
			todolist,
		},
	} as const
}

// ==========================

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (todolistId: string) => {
	return {
		type: 'REMOVE-TODOLIST',
		payload: {
			todolistId,
		},
	} as const
}

// ==========================

export type SetEntityStatusType = ReturnType<typeof setEntityStatusAC>

export const setEntityStatusAC = (
	todolistId: string,
	entityStatus: RequestStatusType
) => {
	return {
		type: 'CHANGE-ENTITY-STATUS',
		payload: {
			todolistId,
			entityStatus,
		},
	} as const
}

// ==========================

type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (todolistId: string, newValue: string) => {
	return {
		type: 'CHANGE-TODOLIST-TITLE',
		payload: {
			todolistId,
			newValue,
		},
	} as const
}

// ==========================

type ChangeFilterACType = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (todolistId: string, value: FilterValuesType) => {
	return {
		type: 'CHANGE-FILTER',
		payload: {
			todolistId,
			value,
		},
	} as const
}

// ==========================

export type SetTodolistsType = ReturnType<typeof setTodolistsAC>

export const setTodolistsAC = (todos: TodolistType[]) => {
	return {
		type: 'SET-TODOLISTS',
		todos,
	} as const
}

// ==========================

export type ClearTodolistsData = ReturnType<typeof clearTodolistsDataAC>

export const clearTodolistsDataAC = () => {
	return {
		type: 'CLEAR-TODOLISTS-DATA',
	} as const
}

// ========================== THUNKS ==========================

export const getTodosTC = () => (dispatch: any) => {
	dispatch(appActions.setStatus({ status: 'loading' }))
	todolistApi
		.getTodolists()
		.then(res => {
			dispatch(setTodolistsAC(res.data))
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
				dispatch(addTodolistAC(res.data.data.item))
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
		dispatch(setEntityStatusAC(todolistId, 'loading'))
		todolistApi
			.deleteTodolist(todolistId)
			.then(() => {
				dispatch(appActions.setStatus({ status: 'success' }))
				dispatch(removeTodolistAC(todolistId))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
				dispatch(setEntityStatusAC(todolistId, 'idle'))
			})
	}

export const changeTodolistTitleTC =
	(todolistId: string, newValue: string) => (dispatch: Dispatch) => {
		dispatch(appActions.setStatus({ status: 'loading' }))
		todolistApi
			.updateTodolistTitle(todolistId, newValue)
			.then(() => {
				dispatch(changeTodolistTitleAC(todolistId, newValue))
				dispatch(appActions.setStatus({ status: 'success' }))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
			})
	}
