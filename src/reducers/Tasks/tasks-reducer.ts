import { TasksType } from '../../App'
import {
	AddTodolistACType,
	SetTodolistsType,
} from '../Todolists/todolists-reducer'
import { RemoveTodolistACType } from '../Todolists/todolists-reducer'
import {
	TaskStatus,
	TaskType,
	taskApi,
	UpdatePropertiesType,
	TaskPriority,
} from '../../api/task-api'
import { Dispatch } from 'redux'
import { AppRootStateType } from '../../store/store'

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

		case 'UPDATE-TASK': {
			return {
				...state,
				[action.payload.todolistId]: state[action.payload.todolistId].map(
					task =>
						task.id === action.payload.taskId
							? { ...task, ...action.payload.model }
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

// ========================== TYPES ==========================

type TasksReducerType =
	| AddTaskACType
	| RemoveTaskACType
	| updateTaskType
	| AddTodolistACType
	| RemoveTodolistACType
	| SetTodolistsType
	| SetTasksACType

type UpdateDomainTaskModelType = {
	description?: string
	title?: string
	status?: TaskStatus
	priority?: TaskPriority
	startDate?: string
	deadline?: string
}

// ========================== ACTIONS ==========================

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

type updateTaskType = ReturnType<typeof updateTaskAC>

export const updateTaskAC = (
	todolistId: string,
	taskId: string,
	model: UpdateDomainTaskModelType
) => {
	return {
		type: 'UPDATE-TASK',
		payload: {
			todolistId,
			taskId,
			model,
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

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
	taskApi.getTasks(todolistId).then(res => {
		const tasks = res.data.items
		dispatch(setTasksAC(tasks, todolistId))
	})
}

export const addTaskTC =
	(todolistId: string, title: string) => (dispatch: Dispatch) => {
		taskApi.createTask(todolistId, title).then(res => {
			dispatch(addTaskAC(res.data.data.item))
		})
	}

export const deleteTaskTC =
	(todolistId: string, taskId: string) => (dispatch: Dispatch) => {
		taskApi.deleteTask(todolistId, taskId).then(() => {
			dispatch(removeTaskAC(taskId, todolistId))
		})
	}

export const updateTaskTC =
	(todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
	(dispatch: Dispatch, getState: () => AppRootStateType) => {
		const tasks = getState().tasks

		const task = tasks[todolistId].find(task => task.id === taskId)

		if (task) {
			const update: UpdatePropertiesType = {
				description: task.description,
				title: task.title,
				priority: task.priority,
				startDate: task.startDate,
				deadline: task.deadline,
				status: task.status,
				...model,
			}

			taskApi.updateTask(todolistId, taskId, update).then(() => {
				dispatch(updateTaskAC(todolistId, taskId, model))
			})
		}
	}
