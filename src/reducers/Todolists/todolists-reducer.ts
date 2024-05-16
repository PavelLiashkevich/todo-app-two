import { v1 } from 'uuid'
import { ResultCode, TodolistType, todolistApi } from '../../api/todolist-api'
import { Dispatch } from 'redux'
import {
	RequestStatusType,
	setStatusLoadingAC,
} from '../App/app-reducer'
import { handleServerNetworkError, serverNetworkError } from '../../utils/error-utils'

export let todolistID1 = v1()

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (
	state: TodolistDomainType[] = initialState,
	action: TodolistReducerType
): TodolistDomainType[] => {
	switch (action.type) {
		case 'ADD-TODOLIST': {
			return [
				{
					id: action.payload.todolistId,
					title: action.payload.title,
					filter: 'all',
					addedDate: Date.now().toString(),
					order: 0,
					entityStatus: 'idle',
				},
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

// ========================== ACTIONS ==========================

export type AddTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title: string) => {
	return {
		type: 'ADD-TODOLIST',
		payload: {
			title,
			todolistId: v1(),
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

// ========================== THUNKS ==========================

export const getTodosTC = () => (dispatch: Dispatch) => {
	todolistApi.getTodolists().then(res => {
		dispatch(setStatusLoadingAC('success'))
		dispatch(setTodolistsAC(res.data))
	})
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
	dispatch(setStatusLoadingAC('loading'))
	todolistApi
		.createTodolist(title)
		.then(res => {
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(addTodolistAC(res.data.data.item.title))
			} else {
				serverNetworkError(dispatch, res.data) 
			}
			dispatch(setStatusLoadingAC('success'))
		})
		.catch(error => {
			handleServerNetworkError(dispatch, error)
		})
}

export const removeTodolistTC =
	(todolistId: string) => (dispatch: Dispatch) => {
		dispatch(setStatusLoadingAC('loading'))
		dispatch(setEntityStatusAC(todolistId, 'loading'))
		todolistApi
			.deleteTodolist(todolistId)
			.then(() => {
				dispatch(setStatusLoadingAC('success'))
				dispatch(removeTodolistAC(todolistId))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
				dispatch(setEntityStatusAC(todolistId, 'idle'))
			})
	}

export const changeTodolistTitleTC =
	(todolistId: string, newValue: string) => (dispatch: Dispatch) => {
		dispatch(setStatusLoadingAC('loading'))
		todolistApi
			.updateTodolistTitle(todolistId, newValue)
			.then(() => {
				dispatch(changeTodolistTitleAC(todolistId, newValue))
				dispatch(setStatusLoadingAC('success'))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
			})
	}
