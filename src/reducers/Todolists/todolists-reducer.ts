import { v1 } from 'uuid'
import { TodolistType, todolistApi } from '../../api/todolist-api'
import { Dispatch } from 'redux'
import { setStatusError, setStatusLoading } from '../App/app-reducer'

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
				},
				...state,
			]
		}

		case 'REMOVE-TODOLIST': {
			return state.filter(todolist => todolist.id !== action.payload.todolistId)
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
}

type TodolistReducerType =
	| RemoveTodolistACType
	| AddTodolistACType
	| ChangeTodolistTitleACType
	| ChangeFilterACType
	| SetTodolistsType

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
		dispatch(setStatusLoading('success'))
		dispatch(setTodolistsAC(res.data))
	})
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
	dispatch(setStatusLoading('loading'))
	todolistApi.createTodolist(title).then(res => {
		if(res.data.resultCode === 0) {
			dispatch(addTodolistAC(res.data.data.item.title))
		} else {
			if(res.data.messages.length) {
				dispatch(setStatusError(res.data.messages[0]))
				
			} else {
				dispatch(setStatusError('Something went wrong!'))
			
			}
		}
		dispatch(setStatusLoading('success'))
	})
}

export const removeTodolistTC =
	(todolistId: string) => (dispatch: Dispatch) => {
		dispatch(setStatusLoading('loading'))
		todolistApi.deleteTodolist(todolistId).then(() => {
			dispatch(setStatusLoading('success'))
			dispatch(removeTodolistAC(todolistId))
		})
	}

export const changeTodolistTitleTC =
	(todolistId: string, newValue: string) => (dispatch: Dispatch) => {
		dispatch(setStatusLoading('loading'))
		todolistApi.updateTodolistTitle(todolistId, newValue).then(() => {
			dispatch(changeTodolistTitleAC(todolistId, newValue))
			dispatch(setStatusLoading('success'))
		})
	}
