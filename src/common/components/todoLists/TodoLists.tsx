import React, { useCallback, useEffect } from 'react'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../addItemForm/AddItemForm'
import {
	FilterValuesType,
	TodolistDomainType,
	setTodolists,
	removeTodolists,
	addTodolists,
	todolistsActions,
	changeTodolistsTitle,
} from '../../../features/reducers/Todolists/todolists-reducer'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { TodoList } from '../todoList/TodoList'
import { Navigate } from 'react-router-dom'
import { selectStatus } from '../../../features/reducers/App/app-reducer'
import { selectIsLoggedIn } from '../../../features/auth/model/auth-reducer'

export const TodoLists = () => {
	const todolists = useAppSelector<TodolistDomainType[]>(
		state => state.todolists
	)

	const status = useAppSelector(selectStatus)

	const isLoggedIn = useAppSelector(selectIsLoggedIn)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isLoggedIn) return
		dispatch(setTodolists())
	}, [])

	//* TODOLISTS

	// Добавление нового тудулиста
	const addTodolist = useCallback((title: string) => {
		dispatch(addTodolists(title))
	}, [])

	// Удаление тудулиста при нажатии на крестик
	const removeTodolist = useCallback((todolistId: string) => {
		dispatch(removeTodolists(todolistId))
	}, [])

	// Сохранение тудулиста после редактирование
	const changeTodolistTitle = useCallback(
		(todolistId: string, newValue: string) => {
			dispatch(changeTodolistsTitle({todolistId, newValue}))
		},
		[]
	)

	// Фильтрация тасок при нажатии на кнопки
	const changeFilter = useCallback(
		(todolistId: string, filter: FilterValuesType) => {
			dispatch(todolistsActions.changeFilter({ todolistId, filter }))
		},
		[]
	)

	if (!isLoggedIn) {
		return <Navigate to='/login' />
	}

	return (
		<>
			<Grid container>
				<AddItemForm addItem={addTodolist} disable={status === 'loading'} />
			</Grid>
			<Grid container spacing={3} sx={{ justifyContent: 'center' }}>
				{todolists?.map((todolist, index) => {
					return (
						<Grid key={index} item>
							<Paper>
								<TodoList
									id={todolist.id}
									entityStatus={todolist.entityStatus}
									title={todolist.title}
									changeFilter={changeFilter}
									changeTodolistTitle={changeTodolistTitle}
									removeTodolist={removeTodolist}
									filter={todolist.filter}
								/>
							</Paper>
						</Grid>
					)
				})}
			</Grid>
		</>
	)
}
