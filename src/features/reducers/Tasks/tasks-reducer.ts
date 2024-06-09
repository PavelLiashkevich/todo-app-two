import { Dispatch } from 'redux'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
	TaskType,
	taskApi,
	UpdatePropertiesType,
	AddTaskArgsType,
	UpdateTaskArgsType,
} from '../../../api/task-api'
import { ResultCode } from 'api/todolist-api'
import { TasksType } from 'app/App'
import { appActions } from '../App/app-reducer'
import { todolistsActions } from 'features/reducers/Todolists/todolists-reducer'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'

import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { TaskPriority, TaskStatus } from 'common/enums/enums'

const slice = createSlice({
	name: 'tasks',
	initialState: {} as TasksType,
	reducers: {
		//removeTask: (
		//	state,
		//	action: PayloadAction<{ taskId: string; todolistId: string }>
		//) => {
		//	const tasks = state[action.payload.todolistId]
		//	const index = tasks.findIndex(task => task.id === action.payload.taskId)
		//	if (index !== -1) {
		//		tasks.splice(index, 1)
		//	}
		//},
	},
	extraReducers: builder => {
		builder
			.addCase(getTasks.fulfilled, (state, action) => {
				state[action.payload.todolistId] = action.payload.tasks
			})
			.addCase(addTask.fulfilled, (state, action) => {
				state[action.payload.task.todoListId].unshift(action.payload.task)
			})
			.addCase(removeTask.fulfilled, (state, action) => {
				const tasks = state[action.payload.todolistId]

				const index = tasks.findIndex(task => task.id === action.payload.taskId)
				if (index !== -1) {
					tasks.splice(index, 1)
				}
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(task => task.id === action.payload.taskId)
				if (index !== -1) {
					tasks[index] = { ...tasks[index], ...action.payload.model }
				}
			})
			.addCase(todolistsActions.addTodolist, (state, action) => {
				state[action.payload.todolist.id] = []
			})
			.addCase(todolistsActions.removeTodolist, (state, action) => {
				let { [action.payload.todolistId]: deleteId, ...rest } = state
				return rest
			})
			.addCase(todolistsActions.setTodolists, (state, action) => {
				action.payload.todolists.forEach(todolist => {
					state[todolist.id] = []
				})
			})
			.addCase(clearTasksAndTodolistsData, (state, action) => {
				return action.payload.tasks
			})
	},
})

// ========================== TYPES ==========================

export type UpdateDomainTaskModelType = {
	description?: string
	title?: string
	status?: TaskStatus
	priority?: TaskPriority
	startDate?: string
	deadline?: string
}

// ========================== THUNKS ==========================

// typePrefix - имя slice/имя thunk
const getTasks = createAppAsyncThunk<
	{ tasks: TaskType[]; todolistId: string },
	string
>(`${slice.name}/getTasks`, async (todolistId: string, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI
	try {
		dispatch(appActions.setStatus({ status: 'loading' }))
		const res = await taskApi.getTasks(todolistId)
		const tasks = res.data.items
		dispatch(appActions.setStatus({ status: 'success' }))
		return { tasks, todolistId }
	} catch (error) {
		handleServerNetworkError(dispatch, error)
		return rejectWithValue(null)
	}
})

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgsType>(
	`${slice.name}/addTask`,
	async (arg, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await taskApi.createTask(arg)

			if (res.data.resultCode === ResultCode.SUCCESS) {
				const task = res.data.data.item
				dispatch(appActions.setStatus({ status: 'success' }))
				return { task }
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue(null)
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

const deleteTask = createAppAsyncThunk<any, any>(
	`${slice.name}/deleteTask`,
	async (arg: { taskId: string; todolistId: string }, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await taskApi.deleteTask(arg.todolistId, arg.taskId)
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				//thunkAPI.dispatch(
				//	tasksActions.removeTask({
				//		taskId: arg.taskId,
				//		todolistId: arg.todolistId,
				//	})
				//)
				return { taskId: arg.taskId, todolistId: arg.todolistId }
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

const updateTask = createAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>(
	`${slice.name}/updateTask`,
	async (arg, thunkAPI) => {
		const { dispatch, rejectWithValue, getState } = thunkAPI

		try {
			const tasks = getState().tasks
			const task = tasks[arg.todolistId].find(task => task.id === arg.taskId)

			if (!task) {
				console.warn('task not found in the state')
				return rejectWithValue(null)
			}

			const updateModel: UpdatePropertiesType = {
				description: task.description,
				title: task.title,
				priority: task.priority,
				startDate: task.startDate,
				deadline: task.deadline,
				status: task.status,
				...arg.model,
			}

			const res = await taskApi.updateTask(
				arg.todolistId,
				arg.taskId,
				updateModel
			)

			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				return arg
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue(null)
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { getTasks, addTask, updateTask, deleteTask }
