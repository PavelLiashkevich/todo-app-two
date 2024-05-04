import { v1 } from 'uuid'
import { TodolistType } from '../../api/todolist-api'

export let todolistID1 = v1()

const initialState: TodolistDomainType[] = []

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
}

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

type TodolistReducerType =
	| RemoveTodolistACType
	| AddTodolistACType
	| ChangeTodolistTitleACType
	| ChangeFilterACType
	| SetTodolistsType

// ==========================

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

type SetTodolistsType = ReturnType<typeof setTodolistsAC>

export const setTodolistsAC = (todos: TodolistType[]) => {
	return {
		type: 'SET-TODOLISTS',
		todos,
	} as const
}
