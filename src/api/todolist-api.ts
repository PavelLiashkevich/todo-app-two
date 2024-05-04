import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,

	headers: {
		'Access-Control-Allow-Origin': '*',
	},
})

//instance.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  next();
//});

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
		return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
	},

	updateTodolistTitle(todolistId: string, title: string) {
		return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title })
	},
}

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
