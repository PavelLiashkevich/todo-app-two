import { createAction } from '@reduxjs/toolkit'
import { TasksType } from 'App'
import { TodolistDomainType } from 'reducers/Todolists/todolists-reducer'

export type clearTasksAndTodolistsDataType = {
	tasks: TasksType
	todolists: TodolistDomainType[]
}

export const clearTasksAndTodolistsData =
	createAction<clearTasksAndTodolistsDataType>(
		'common/clearTasksAndTodolistsData'
	)
