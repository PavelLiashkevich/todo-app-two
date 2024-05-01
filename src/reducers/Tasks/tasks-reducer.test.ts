import { changeTaskTitleAC, tasksReducer } from './tasks-reducer'
import { TasksType } from '../../App'
import {
	addTodolistAC,
	removeTodolistAC,
	todolistID1,
} from '../Todolists/todolists-reducer'
import { TaskPriority, TaskStatus } from '../../api/task-api'

test('correct task title', () => {
	const startState: TasksType = {
		todolistId1: [
			{
				id: '1',
				title: 'CSS',
				status: TaskStatus.Completed,
				todoListId: todolistID1,
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
				todoListId: todolistID1,
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
				todoListId: todolistID1,
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
		],
	}

	const action = changeTaskTitleAC('2', 'Milk', 'todolistId1')

	const endState = tasksReducer(startState, action)

	expect(endState['todolistId1'][1].title).toBe('Milk')
})

// ==========================

test('new array should be added when new todolist is added', () => {
	const startState: TasksType = {
		todolistId1: [
			{
				id: '1',
				title: 'CSS',
				status: TaskStatus.Completed,
				todoListId: todolistID1,
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
				status: TaskStatus.Completed,
				todoListId: todolistID1,
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
				todoListId: todolistID1,
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
		],
	}

	const action = addTodolistAC('new todolist')

	const endState = tasksReducer(startState, action)

	const keys = Object.keys(endState)
	const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
	if (!newKey) {
		throw Error('new key should be added')
	}

	expect(keys.length).toBe(3)
	expect(endState[newKey]).toEqual([])
})

// ==========================

test('property with todolistId should be deleted', () => {
	const startState: TasksType = {
		todolistId1: [
			{
				id: '1',
				title: 'CSS',
				status: TaskStatus.Completed,
				todoListId: todolistID1,
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
				status: TaskStatus.Completed,
				todoListId: todolistID1,
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
				status: TaskStatus.InProgress,
				todoListId: todolistID1,
				description: '',
				startDate: '',
				deadline: '',
				addedDate: '',
				order: 0,
				priority: TaskPriority.Low,
			},
		],
	}

	const action = removeTodolistAC('todolistId2')

	const endState = tasksReducer(startState, action)

	const keys = Object.keys(endState)

	expect(keys.length).toBe(1)
	expect(endState['todolistId2']).not.toBeDefined()
})
