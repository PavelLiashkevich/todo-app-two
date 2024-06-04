import {
	TaskStatus,
	TaskType,
	taskApi,
	UpdatePropertiesType,
	TaskPriority,
} from '../../api/task-api'
import { Dispatch } from 'redux'
import { AppRootStateType } from '../../store/store'
import { appActions } from '../App/app-reducer'
import { ResultCode } from '../../api/todolist-api'
import {
	handleServerNetworkError,
	serverNetworkError,
} from '../../utils/error-utils'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { todolistsActions } from 'reducers/Todolists/todolists-reducer'
import { TasksType } from 'App'
import { clearTasksAndTodolistsData } from 'common/actions/common-actions'

const slice = createSlice({
	name: 'tasks',
	initialState: {} as TasksType,
	reducers: {
		addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
			{
				state[action.payload.task.todoListId].unshift(action.payload.task)
			}
		},
		removeTask: (
			state,
			action: PayloadAction<{ taskId: string; todolistId: string }>
		) => {
			const tasks = state[action.payload.todolistId]

			const index = tasks.findIndex(task => task.id === action.payload.taskId)
			if (index !== -1) {
				tasks.splice(index, 1)
			}
		},
		updateTask: (
			state,
			action: PayloadAction<{
				todolistId: string
				taskId: string
				model: UpdateDomainTaskModelType
			}>
		) => {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex(task => task.id === action.payload.taskId)
			if (index !== -1) {
				tasks[index] = { ...tasks[index], ...action.payload.model }
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getTasks.fulfilled, (state, action) => {
				state[action.payload.todolistId] = action.payload.tasks
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

type UpdateDomainTaskModelType = {
	description?: string
	title?: string
	status?: TaskStatus
	priority?: TaskPriority
	startDate?: string
	deadline?: string
}

// ========================== THUNKS ==========================

// typePrefix - имя slice/имя thunk
const getTasks = createAsyncThunk(
	`${slice.name}/getTasks`,
	async (todolistId: string, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await taskApi.getTasks(todolistId)
			const tasks = res.data.items
			dispatch(appActions.setStatus({ status: 'success' }))
			return { tasks, todolistId }
		} catch (error: any) {
			handleServerNetworkError(dispatch, error)
			return rejectWithValue(null)
		}
	}
)

export const addTaskTC =
	(todolistId: string, title: string) => (dispatch: Dispatch) => {
		dispatch(appActions.setStatus({ status: 'loading' }))
		taskApi
			.createTask(todolistId, title)
			.then(res => {
				if (res.data.resultCode === ResultCode.SUCCESS) {
					dispatch(tasksActions.addTask({ task: res.data.data.item }))
					dispatch(appActions.setStatus({ status: 'success' }))
				} else {
					serverNetworkError(dispatch, res.data)
				}
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
			})
	}

export const deleteTaskTC =
	(todolistId: string, taskId: string) => (dispatch: Dispatch) => {
		dispatch(appActions.setStatus({ status: 'loading' }))
		taskApi
			.deleteTask(todolistId, taskId)
			.then(() => {
				dispatch(appActions.setStatus({ status: 'success' }))
				dispatch(tasksActions.removeTask({ taskId, todolistId }))
			})
			.catch(error => {
				handleServerNetworkError(dispatch, error)
			})
	}

export const updateTaskTC =
	(todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
	(dispatch: Dispatch, getState: () => AppRootStateType) => {
		dispatch(appActions.setStatus({ status: 'loading' }))

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

			taskApi
				.updateTask(todolistId, taskId, update)
				.then(res => {
					if (res.data.resultCode === ResultCode.SUCCESS) {
						dispatch(tasksActions.updateTask({ todolistId, taskId, model }))
						dispatch(appActions.setStatus({ status: 'success' }))
					} else {
						serverNetworkError(dispatch, res.data)
					}
				})
				.catch(error => {
					handleServerNetworkError(dispatch, error)
				})
		}
	}

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { getTasks }
