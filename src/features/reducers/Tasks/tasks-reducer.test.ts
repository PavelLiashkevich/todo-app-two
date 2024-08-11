import { TasksType } from '../../../app/App'

import { ActionForTest } from 'common/type/ActionForTest'
import { TaskPriority, TaskStatus } from 'common/enums'
import { tasksReducer, tasksThunks } from './tasks-reducer'
import { todolistsActions, removeTodolists } from 'features/reducers/Todolists/todolists-reducer'

let startState: TasksType = {}
beforeEach(() => {
	startState = {
		todolistId1: [
			{
				id: '1',
				title: 'CSS',
				status: TaskStatus.Completed,
				todoListId: 'todolistId1',
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
			{
				id: '2',
				title: 'JS',
				status: TaskStatus.InProgress,
				todoListId: 'todolistId1',
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
			{
				id: '3',
				title: 'React',
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
		todolistId2: [
			{
				id: '1',
				title: 'Redux',
				status: TaskStatus.InProgress,
				todoListId: 'todolistId2',
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
		],
	}
})

// ==========================

//test('property with todolistId should be deleted', () => {
//	const endState = tasksReducer(
//		startState,
//		removeTodolists.fulfilled({ todolistId: 'todolistId1' })
//	)

//	const keys = Object.keys(endState)

//	expect(keys.length).toBe(1)
//	expect(endState['todolistId2']).not.toBeDefined()
//})

// ==========================
// 1 variant
test('tasks should be added for todolist', () => {
	const action = tasksThunks.getTasks.fulfilled(
		{
			tasks: startState['todolistId1'],
			todolistId: 'todolistId1',
		},
		'requestId',
		'todolistId1'
	)
	const endState = tasksReducer(
		{
			todolistId2: [],
			todolistId1: [],
		},
		action
	)
	expect(endState['todolistId1'].length).toBe(4)
	expect(endState['todolistId2'].length).toBe(1)
})

// 2 variant
test('tasks should be added for todolist-2', () => {
	type FetchTaskAction = Omit<
		ReturnType<typeof tasksThunks.getTasks.fulfilled>,
		'meta'
	>

	const action: FetchTaskAction = {
		type: tasksThunks.getTasks.fulfilled.type,
		payload: {
			tasks: startState['todolistId1'],
			todolistId: 'todolistId1',
		},
	}
	const endState = tasksReducer(
		{
			todolistId2: [],
			todolistId1: [],
		},
		action
	)
	expect(endState['todolistId1'].length).toBe(4)
	expect(endState['todolistId2'].length).toBe(1)
})

// ==========================

test('status of specified task should be updated'),
	() => {
		const action: ActionForTest<typeof tasksThunks.updateTask.fulfilled> = {
			type: tasksThunks.updateTask.fulfilled.type,
			payload: {
				taskId: '1',
				todolistId: 'todolistId1',
				model: { status: TaskStatus.InProgress },
			},
		}
		const endState = tasksReducer(startState, action)

		expect(endState['todolistId1'][0].status).toBe(TaskStatus.InProgress)
		expect(endState['todolistId1'][2].status).toBe(TaskStatus.Completed)
	}

// ==========================

test('title of specified task should be updated'),
	() => {
		const action: ActionForTest<typeof tasksThunks.updateTask.fulfilled> = {
			type: tasksThunks.updateTask.fulfilled.type,
			payload: {
				taskId: '1',
				todolistId: 'todolistId1',
				model: { title: 'Redux Toolkit' },
			},
		}
		const endState = tasksReducer(startState, action)

		expect(endState['todolistId1'][0].title).toBe('Redux Toolkit')
	}
