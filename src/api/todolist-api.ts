import { instance } from 'common/instance'
import { BaseResponse } from '../common/types/BaseResponse'

// ========================== API ==========================

export const todolistApi = {
	getTodolists() {
		return instance.get<TodolistType[]>('todo-lists')
	},

	createTodolist(title: string) {
		return instance.post<BaseResponse<{ item: TodolistType }>>('todo-lists', {
			title,
		})
	},

	deleteTodolist(todolistId: string) {
		return instance.delete<BaseResponse<{ item: TodolistType }>>(
			`todo-lists/${todolistId}`
		)
	},

	updateTodolistTitle(todolistId: string, title: string) {
		return instance.put<BaseResponse>(`todo-lists/${todolistId}`, { title })
	},
}
// ========================== TYPES ==========================

export type TodolistType = {
	addedDate: string
	id: string
	order: number
	title: string
}

export enum ResultCode {
	SUCCESS = 0,
	ERROR = 1,
	RECAPTCHA_FAILED = 2,
}
