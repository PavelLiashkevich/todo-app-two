import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,

	headers: {
		'API-KEY': 'fb09a13d-7cac-451e-afc1-b441cb18c671',
	},
})

// ========================== API ==========================

export const todolistApi = {
	getTodolists() {
		return instance.get<TodolistType[]>('todo-lists')
	},

	createTodolist(title: string) {
		return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {
			title,
		})
	},

	deleteTodolist(todolistId: string) {
		return instance.delete<ResponseType<{ item: TodolistType }>>(
			`todo-lists/${todolistId}`
		)
	},

	updateTodolistTitle(todolistId: string, title: string) {
		return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title })
	},
}
// ========================== TYPES ==========================

export type TodolistType = {
	addedDate: string
	id: string
	order: number
	title: string
}

type ResponseType<T = {}> = {
	resultCode: number
	messages: string[]
	fieldsErrors: FieldErrorType[]
	data: T
}

type FieldErrorType = {
	error: string
	field: string
}

export enum ResultCode {
	SUCCESS = 0,
	ERROR = 1,
	RECAPTCHA_FAILED = 2,
}
