import { v1 } from 'uuid'
import { TasksType } from '../../App'
import {
	AddTodolistACType,
	SetTodolistsType,
} from '../Todolists/todolists-reducer'
import { RemoveTodolistACType } from '../Todolists/todolists-reducer'
import { TaskPriority, TaskStatus, TaskType, taskApi } from '../../api/task-api'
import { Dispatch } from 'redux'

let initialState: TasksType = {}

export const tasksReducer = (
	state: TasksType = initialState,
	action: TasksReducerType
): TasksType => {
	switch (action.type) {
		case 'ADD-TASK': {
			return {
				...state,
				[action.payload.task.todoListId]: [
					action.payload.task,
					...state[action.payload.task.todoListId],
				],
			}
		}

		case 'REMOVE-TASK': {
			return {
				...state,
				[action.payload.todolistId]: state[action.payload.todolistId].filter(
					task => task.id !== action.payload.taskId
				),
			}
		}

		case 'CHANGE-TASK-TITLE': {
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

		case 'CHANGE-TASK-STATUS': {
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

		case 'SET-TASKS': {
			return {
				...state,
				[action.payload.todolistId]: action.payload.tasks,
			}
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
	| SetTasksACType

// ==========================

type AddTaskACType = ReturnType<typeof addTaskAC>

export const addTaskAC = (task: TaskType) => {
	return {
		type: 'ADD-TASK',
		payload: {
			task,
		},
	} as const
}

// ==========================

type RemoveTaskACType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (taskId: string, todolistId: string) => {
	return {
		type: 'REMOVE-TASK',
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
		type: 'CHANGE-TASK-STATUS',
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
		type: 'CHANGE-TASK-TITLE',
		payload: {
			taskId,
			newValue,
			todolistId,
		},
	} as const
}
// ==========================

type SetTasksACType = ReturnType<typeof setTasksAC>

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
	return {
		type: 'SET-TASKS',
		payload: {
			tasks,
			todolistId,
		},
	} as const
}

// ========================== THUNKS ==========================

export const getTasksThunk = (todolistId: string) => (dispatch: Dispatch) => {
	taskApi.getTasks(todolistId).then(res => {
		const tasks = res.data.items
		dispatch(setTasksAC(tasks, todolistId))
	})
}

export const addTaskThunk =
	(todolistId: string, title: string) => (dispatch: Dispatch) => {
		taskApi.createTask(todolistId, title).then(res => {
			dispatch(addTaskAC(res.data.data.item))
		})
	}

export const deleteTasksThunk =
	(todolistId: string, taskId: string) => (dispatch: Dispatch) => {
		taskApi.deleteTask(todolistId, taskId).then(() => {
			dispatch(removeTaskAC(taskId, todolistId))
		})
	}

