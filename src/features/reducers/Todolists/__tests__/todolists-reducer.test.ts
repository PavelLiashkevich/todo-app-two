import {
	removeTodolists,
	addTodolists,
	changeTodolistsTitle,
} from 'features/reducers/Todolists/todolists-reducer'
import { v1 } from 'uuid'
import {
	TodolistDomainType,
	todolistsActions,
	todolistsReducer,
} from './todolists-reducer'
import { TodolistType } from 'api/todolist-api'

let todolistId1: string
let todolistId2: string

let startState: TodolistDomainType[]

beforeEach(() => {
	todolistId1 = v1()
	todolistId2 = v1()

	startState = [
		{
			id: todolistId1,
			title: 'What to learn',
			filter: 'all',
			entityStatus: 'idle',
			addedDate: '',
			order: 0,
		},
		{
			id: todolistId2,
			title: 'What to buy',
			filter: 'all',
			entityStatus: 'idle',
			addedDate: '',
			order: 0,
		},
	]
})

//test('correct todolist should be added', () => {
//  let todolist: TodolistType = {
//    addedDate: '',
//    id: 'otherId',
//    order: 0,
//    title: 'New Todolist',
//  }

//  const endState = todolistsReducer(startState, addTodolists({todolist}))

//  expect(endState.length).toBe(3)
//})

// ==========================

//test('correct todolist should be removed', () => {
//  const endState = todolistsReducer(startState, todolistsActions.removeTodolists({todolistId: todolistId1}))

//  expect(endState[0].id).toBe(todolistId2)
//  expect(endState[0].title).toBe('What to buy')
//})

// ==========================

test('correct todolist title should be changed', () => {
	let newTodolistTitle = 'New Todo'

	let payload = { todolistId: todolistId2, newValue: newTodolistTitle }

	const action = changeTodolistsTitle.fulfilled(payload, 'requestId', payload)

	const endState = todolistsReducer(startState, action)

	expect(endState[1].title).toBe('New Todo')
})
