import { instance } from 'common/instance'
import { BaseResponse } from '../common/types/BaseResponse'
import {
	AddTaskArgsType,
	GetTasksResponseType,
	TaskType,
	UpdatePropertiesType,
} from './task-api.types'

export const taskApi = {
	getTasks(todolistId: string) {
		return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`)
	},

	createTask(param: AddTaskArgsType) {
		const { todolistId, title } = param
		return instance.post<BaseResponse<{ item: TaskType }>>(
			`todo-lists/${todolistId}/tasks`,
			{ title }
		)
	},

	deleteTask(todolistId: string, taskId: string) {
		return instance.delete<BaseResponse>(
			`todo-lists/${todolistId}/tasks/${taskId}`
		)
	},

	updateTask(todolistId: string, taskId: string, model: UpdatePropertiesType) {
		return instance.put<BaseResponse>(
			`todo-lists/${todolistId}/tasks/${taskId}`,
			model
		)
	},
}
