import { v1 } from 'uuid'
import {
	TodolistDomainType,
	changeTodolistTitleAC,
	removeTodolistAC,
	todolistsReducer,
} from './todolists-reducer'

let todolistId1: string
let todolistId2: string
let todolistId3: string
let startState: TodolistDomainType[]

beforeEach(() => {
	todolistId1 = v1()
	todolistId2 = v1()
	todolistId3 = v1()

	startState = []
})

test('correct todolist should be removed', () => {
	const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

	expect(endState[1].title).toBe('Other')
	expect(endState[0].id).toBe(todolistId2)
})

// ==========================

test('correct todolist title should be changed', () => {
	const endState = todolistsReducer(
		startState,
		changeTodolistTitleAC(todolistId3, 'OtherNew')
	)

	expect(endState[2].title).toBe('OtherNew')
})
