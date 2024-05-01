import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,
})

export const taskApi = {
	getTasks(todolistId: string) {
		return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`)
	},

	createTask(todolistId: string, title: string) {
		return instance.post<TaskType>(`todo-lists/${todolistId}/tasks`, { title })
	},

	deleteTask(todolistId: string, taskId: string) {
		return instance.delete<TaskResponseType>(
			`todo-lists/${todolistId}/tasks/${taskId}`
		)
	},

	updateTask(todolistId: string, taskId: string, update: UpdatePropertiesType) {
		return instance.put<TaskResponseType>(
			`todo-lists/${todolistId}/tasks/${taskId}`,
			update
		)
	},
}

export enum TaskStatus {
	New = 0,
	InProgress = 1,
	Completed = 2,
	Draft = 3,
}

export enum TaskPriority {
	Low = 0,
	Medium = 1,
	High = 2,
	Urgent = 3,
	Later = 4,
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

type TaskResponseType<T = {}> = {
	resultCode: number
	messages: string[]
	data: T
}

type UpdatePropertiesType = {
	description: string
	title: string
	status: number
	priority: number
	startDate: string
	deadline: string
}
