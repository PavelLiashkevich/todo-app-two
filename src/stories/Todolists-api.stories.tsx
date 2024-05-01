import React, { useEffect, useState } from 'react'
import { todolistApi } from '../api/todolist-api'

export default {
	title: 'API',
}

export const GetTodolists = () => {
	const [state, setState] = useState<any>(null)

	useEffect(() => {
		todolistApi.getTodolists().then(res => {
			setState(res.data)
		})
	}, [])

	return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
	const [state, setState] = useState<any>(null)
	useEffect(() => {
		const title = 'Typescript'

		todolistApi.createTodolist(title).then(res => setState(res.data))
	}, [])

	return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
	const [state, setState] = useState<any>(null)
	useEffect(() => {
		const todolistId = '35612122-fecb-47b3-afaf-a7f57703809d'

		todolistApi.deleteTodolist(todolistId).then(res => setState(res.data))
	}, [])

	return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
	const [state, setState] = useState<any>(null)
	useEffect(() => {
		const todolistId = '1c5c34fa-c544-41f5-b242-b549de6a1dff'
		const title = 'MOBX'

		todolistApi
			.updateTodolistTitle(todolistId, title)
			.then(res => setState(res.data))
	}, [])

	return <div>{JSON.stringify(state)}</div>
}
