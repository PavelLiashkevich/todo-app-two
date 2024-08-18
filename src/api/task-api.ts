import { instance } from 'common/instance'
import { BaseResponse } from '../common/type/BaseResponse'
import { TaskStatus, TaskPriority } from '../common/enums'
import { UpdateDomainTaskModelType } from 'features/reducers/Tasks/tasks-reducer'

// ========================== API ==========================

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

// ========================== TYPES ==========================

export type AddTaskArgsType = {
	todolistId: string
	title: string
}

export type UpdateTaskArgsType = {
	todolistId: string
	taskId: string
	model: UpdateDomainTaskModelType
}

export type TaskType = {
	description: string
	title: string
	status: TaskStatus
	priority: TaskPriority
	startDate: string
	deadline: string
	id: string
	todoListId: string
	order: number
	addedDate: string
}

type FieldErrorType = {
	error: string
	field: string
}

type GetTasksResponseType = {
	totalCount: number
	error: FieldErrorType
	items: TaskType[]
}

export type UpdatePropertiesType = {
	description: string
	title: string
	status: TaskStatus
	priority: TaskPriority
	startDate: string
	deadline: string
}
export { TaskPriority }
