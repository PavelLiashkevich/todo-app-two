import React from 'react'
import { Provider } from 'react-redux'
import { AppRootStateType } from '../../app/store'
import { combineReducers, legacy_createStore } from 'redux'
import { todolistsReducer } from '../../features/reducers/Todolists/todolists-reducer'
import { tasksReducer } from '../../features/reducers/Tasks/tasks-reducer'
import { v1 } from 'uuid'
import { TaskPriority } from '../../api/task-api'
import { TaskStatus } from 'common/enums'

const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
})

const initialGlobalState = {
	todolists: [
		{
			id: 'todolistId1',
			title: 'To-do List 1',
			filter: 'all',
			addedDate: '',
			order: 0,
		},
	],
	tasks: {
		['todolistId1']: [
			{
				id: v1(),
				title: 'HTML&CSS',
				status: TaskStatus.New,
				todoListId: 'todolistId1',
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
			{
				id: v1(),
				title: 'JS',
				status: TaskStatus.Completed,
				todoListId: 'todolistId1',
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
		],
	},
}

// @ts-ignore
export const storyBookStore = legacy_createStore(
	rootReducer,
	initialGlobalState as unknown as AppRootStateType
)

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
	return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
