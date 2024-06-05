import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,

	headers: {
		'API-KEY': 'fb09a13d-7cac-451e-afc1-b441cb18c671',
	},
})

// ========================== API ==========================

export const taskApi = {
	getTasks(todolistId: string) {
		return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`)
	},

	createTask(arg: AddTaskArgsType) {
		const {todolistId, title} = arg
		return instance.post<ResponseType<{ item: TaskType }>>(
			`todo-lists/${todolistId}/tasks`,
			{ title }
		)
	},

	deleteTask(todolistId: string, taskId: string) {
		return instance.delete<ResponseType>(
			`todo-lists/${todolistId}/tasks/${taskId}`
		)
	},

	updateTask(args: UpdateTaskArgsType ) {
		const {todolistId, taskId, model} = args
		const update = {...model}

		return instance.put<ResponseType>(
			`todo-lists/${todolistId}/tasks/${taskId}`,
			update
		)
	},
}

// ========================== TYPES ==========================

export type AddTaskArgsType = {
	todolistId: string, 
	title: string
}

export type UpdateTaskArgsType = {
	todolistId: string, 
	taskId: string, 
	model: UpdatePropertiesType
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
