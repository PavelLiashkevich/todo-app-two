import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,

	headers: {
		'API-KEY': '19b20155-3ecd-4d20-a66a-4885db5c3756',
	},
})

// ========================== API ==========================

export const taskApi = {
	getTasks(todolistId: string) {
		return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`)
	},

	createTask(todolistId: string, title: string) {
		return instance.post<ResponseType<{item: TaskType}>>(
			`todo-lists/${todolistId}/tasks`,
			{ title }
		)
	},

	deleteTask(todolistId: string, taskId: string) {
		return instance.delete<ResponseType>(
			`todo-lists/${todolistId}/tasks/${taskId}`
		)
	},

	updateTask(todolistId: string, taskId: string, update: UpdatePropertiesType) {
		return instance.put<ResponseType>(
			`todo-lists/${todolistId}/tasks/${taskId}`,
			update
		)
	},
}

// ========================== TYPES ==========================

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

export type ResponseType<T = {}> = {
	resultCode: number
	//error: FieldErrorType
	messages: string[]
	data: T
}

export type UpdatePropertiesType = {
	description: string
	title: string
	status: TaskStatus
	priority: TaskPriority
	startDate: string
	deadline: string
}
