import { tasksActions, tasksReducer, tasksThunks } from './tasks-reducer'
import { TasksType } from '../../App'
import { TaskPriority, TaskStatus } from '../../api/task-api'
import { todolistsActions } from 'reducers/Todolists/todolists-reducer'

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

test('correct task title', () => {
	const endState = tasksReducer(
		startState,
		tasksActions.updateTask({
			todolistId: 'todolistId1',
			taskId: '2',
			model: { title: 'Redux Toolkit' },
		})
	)

	expect(endState['todolistId1'][1].title).toBe('Redux Toolkit')
})

// ==========================

test('property with todolistId should be deleted', () => {
	const endState = tasksReducer(
		startState,
		todolistsActions.removeTodolist({ todolistId: 'todolistId1' })
	)

	const keys = Object.keys(endState)

	expect(keys.length).toBe(1)
	expect(endState['todolistId2']).not.toBeDefined()
})

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
