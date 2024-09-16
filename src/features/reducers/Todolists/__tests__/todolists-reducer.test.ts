import { v1 } from 'uuid'
import {
    addTodolists,
    changeTodolistsTitle,
    TodolistDomainType,
    todolistsReducer,
	removeTodolists,
} from 'features/reducers/Todolists/todolists-reducer'

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

test('correct todolist should be added', () => {

	const action = {
		type: addTodolists.fulfilled.type,
		payload: { 
			addedDate: '',
			id: 'otherId',
			order: 0,
			title: 'New Todolist', 
		}
	}

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[2].id).toBe('otherId')
    expect(endState[2].title).toBe('New Todolist')
})

// ==========================

test('correct todolist should be removed', () => {

	const action = {
		type: removeTodolists.fulfilled.type,
		payload: { 
			todolistId: todolistId1, 
		}
	}

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
    expect(endState[0].title).toBe('New Todolist')
})

// ==========================

test('correct todolist title should be changed', () => {
    let newTodolistTitle = 'New Todo'

    let payload = { todolistId: todolistId2, title: newTodolistTitle }

    const action = changeTodolistsTitle.fulfilled(payload, 'requestId', payload)

    const endState = todolistsReducer(startState, action)

    expect(endState[1].title).toBe('New Todo')
})