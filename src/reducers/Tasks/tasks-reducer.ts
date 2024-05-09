import { v1 } from 'uuid'
import { TasksType } from '../../App'
import { AddTodolistACType, SetTodolistsType } from '../Todolists/todolists-reducer'
import { RemoveTodolistACType } from '../Todolists/todolists-reducer'
import { TaskPriority, TaskStatus } from '../../api/task-api'

let initialState: TasksType = {
}

export const tasksReducer = (
	state: TasksType = initialState,
	action: TasksReducerType
): TasksType => {
	switch (action.type) {
		case 'ADD_TASK': {
			let newTask = {
				id: v1(),
				title: action.payload.title,
				status: TaskStatus.New,
				todoListId: action.payload.todolistId,
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			}
			return {
				...state,
				[action.payload.todolistId]: [
					newTask,
					...state[action.payload.todolistId],
				],
			}
		}
		case 'REMOVE_TASK': {
			return {
				...state,
				[action.payload.todolistId]: state[action.payload.todolistId].filter(
					task => task.id !== action.payload.taskId
				),
			}
		}

		case 'CHANGE_TASK_TITLE': {
			return {
				...state,
				[action.payload.todolistId]: state[action.payload.todolistId].map(
					task =>
						task.id === action.payload.taskId
							? { ...task, title: action.payload.newValue }
							: task
				),
			}
		}

		case 'CHANGE_TASK_STATUS': {
			return {
				...state,
				[action.payload.todolistId]: state[action.payload.todolistId].map(
					task =>
						task.id === action.payload.taskId
							? { ...task, status: action.payload.status }
							: task
				),
			}
		}
		case 'ADD-TODOLIST': {
			return {
				...state,
				[action.payload.todolistId]: [],
			}
		}

		case 'REMOVE-TODOLIST': {
			//let copyState = { ...initialState }
			//delete copyState[action.payload.todolistId]
			//return copyState

			let { [action.payload.todolistId]: deleteId, ...rest } = state
			return rest
		}

		case 'SET-TODOLISTS': {
			return action.todos.reduce((acc, current) => {
				acc[current.id] = []
				return acc 
			}, {} as TasksType)

		}

		default:
			return state
	}
}

type TasksReducerType =
	| AddTaskACType
	| RemoveTaskACType
	| ChangeTaskStatus
	| ChangeTaskTitleACType
	| AddTodolistACType
	| RemoveTodolistACType
	| SetTodolistsType 

// ==========================

type AddTaskACType = ReturnType<typeof addTaskAC>

export const addTaskAC = (title: string, todolistId: string) => {
	return {
		type: 'ADD_TASK',
		payload: {
			title,
			todolistId,
		},
	} as const
}

// ==========================

type RemoveTaskACType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (taskId: string, todolistId: string) => {
	return {
		type: 'REMOVE_TASK',
		payload: {
			taskId,
			todolistId,
		},
	} as const
}

// ==========================

type ChangeTaskStatus = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (
	todolistId: string,
	taskId: string,
	status: TaskStatus
) => {
	return {
		type: 'CHANGE_TASK_STATUS',
		payload: {
			todolistId,
			taskId,
			status,
		},
	} as const
}

// ==========================

type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

export const changeTaskTitleAC = (
	taskId: string,
	newValue: string,
	todolistId: string
) => {
	return {
		type: 'CHANGE_TASK_TITLE',
		payload: {
			taskId,
			newValue,
			todolistId,
		},
	} as const
}
