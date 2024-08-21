import { createSlice } from '@reduxjs/toolkit'
import { taskApi } from '../../../api/task-api'
import { ResultCode } from 'api/todolist-api'
import { TasksType } from 'app/App'
import { appActions } from '../App/app-reducer'
import {
	setTodolists,
	removeTodolists,
	addTodolists,
} from 'features/reducers/Todolists/todolists-reducer'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'

import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import {
	AddTaskArgsType,
	TaskType,
	UpdatePropertiesType,
	UpdateTaskArgsType,
} from 'api/task-api.types'

const slice = createSlice({
	name: 'tasks',
	initialState: {} as TasksType,
	reducers: {},
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
			.addCase(addTodolists.fulfilled, (state, action) => {
				state[action.payload.todolist.id] = []
			})
			.addCase(removeTodolists.fulfilled, (state, action) => {
				const todolistId = action.payload?.todolistId
				if (todolistId) {
					const { [todolistId]: deleteId, ...rest } = state
					return rest
				}
			})
			.addCase(setTodolists.fulfilled, (state, action) => {
				action.payload.todolists.forEach(todolist => {
					state[todolist.id] = []
				})
			})
			.addCase(clearTasksAndTodolistsData, (state, action) => {
				return action.payload.tasks
			})
	},
})

// ========================== THUNKS ==========================

export const getTasks = createAppAsyncThunk<
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

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgsType>(
	`${slice.name}/addTask`,
	async (param, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await taskApi.createTask(param)

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

export const removeTask = createAppAsyncThunk<any, any>(
	`${slice.name}/removeTask`,
	async (param: { taskId: string; todolistId: string }, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI

		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await taskApi.deleteTask(param.todolistId, param.taskId)
			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				return { taskId: param.taskId, todolistId: param.todolistId }
			}
		} catch (error) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const updateTask = createAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>(
	`${slice.name}/updateTask`,
	async (param, thunkAPI) => {
		const { dispatch, rejectWithValue, getState } = thunkAPI

		try {
			const tasks = getState().tasks
			const task = tasks[param.todolistId].find(
				task => task.id === param.taskId
			)

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
				...param.model,
			}

			const res = await taskApi.updateTask(
				param.todolistId,
				param.taskId,
				updateModel
			)

			if (res.data.resultCode === ResultCode.SUCCESS) {
				dispatch(appActions.setStatus({ status: 'success' }))
				return param
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