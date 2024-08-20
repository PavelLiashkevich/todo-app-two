import { useEffect, useState } from 'react'
import { taskApi } from '../api/task-api'
import { AddTaskArgsType } from 'api/task-api.types'

export default {
	title: 'API-TASK',
}

export const GetTasks = () => {
	const [state, setState] = useState<any>(null)

	useEffect(() => {
		const todolistId = '88761c0b-706c-4e72-82f4-6c7b73c75703'

		taskApi.getTasks(todolistId).then(res => {
			setState(res.data)
		})
	}, [])
	return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
	const [state, setState] = useState<any>(null)

	useEffect(() => {
		const todolistId = '88761c0b-706c-4e72-82f4-6c7b73c75703'
		const title = 'New Task'

		const arg: AddTaskArgsType = { todolistId, title }

		taskApi.createTask(arg).then(res => {
			setState(res.data)
		})
	}, [])
	return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
	const [state, setState] = useState<any>(null)

	useEffect(() => {
		const todolistId = '88761c0b-706c-4e72-82f4-6c7b73c75703'
		const taskId = 'c7964caf-c41a-4214-b243-2a2ea974efad'

		taskApi.deleteTask(todolistId, taskId).then(res => {
			setState(res.data)
		})
	}, [])
	return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
	const [state, setState] = useState<any>(null)

	useEffect(() => {
		const todolistId = '88761c0b-706c-4e72-82f4-6c7b73c75703'
		const taskId = '6d6526ec-c61e-461c-be16-ea6bfff9e1c1'
		const update = {
			description: 'New Task Description',
			title: 'NEWTITLE',
			status: 0,
			priority: 1,
			startDate: '',
			deadline: '',
		}

		taskApi.updateTask(todolistId, taskId, update).then(res => {
			setState(res.data)
		})
	}, [])
	return <div>{JSON.stringify(state)}</div>
}
