import { TaskStatus, TaskPriority } from '../common/enums'

export type GetTasksResponseType = {
	totalCount: number
	error: FieldErrorType
	items: TaskType[]
}

export type AddTaskArgsType = {
	todolistId: string
	title: string
}

export type UpdateTaskArgsType = {
	todolistId: string
	taskId: string
	model: Partial<UpdatePropertiesType>
}

export type UpdatePropertiesType = {
	description: string
	title: string
	status: TaskStatus
	priority: TaskPriority
	startDate: string
	deadline: string
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
